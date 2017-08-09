/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {InterestFormData, ProductInterestFormComponent} from './interests/interests.component';
import {AccountAssignment} from '../../../services/portfolio/domain/account-assignment.model';
import {AccountDesignators} from '../../../services/portfolio/domain/individuallending/account-designators.model';
import {FeeFormData, ProductFeeFormComponent} from './fees/fee.component';
import {ProductParameters} from '../../../services/portfolio/domain/individuallending/product-parameters.model';
import {FimsValidators} from '../../../common/validator/validators';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {FimsProduct} from '../store/model/fims-product.model';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {ProductSettingsFormComponent, SettingsFormData} from './settings/settings.component';
import {temporalOptionList} from '../../../common/domain/temporal.domain';
import {Currency} from '../../../services/currency/domain/currency.model';
import {
  accountIdentifier,
  createAccountAssignment, createLedgerAssignment,
  findAccountDesignator, ledgerIdentifier
} from '../../../common/util/account-assignments';

@Component({
  selector: 'fims-product-form-component',
  templateUrl: './form.component.html'
})
export class ProductFormComponent implements OnInit{

  temporalOptions = temporalOptionList;

  detailForm: FormGroup;

  arrearsAllowanceForm: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input('editMode') editMode: boolean;

  @Input('product') set product(product: FimsProduct) {
    this.prepareDetailForm(product);
    this.prepareSettingsForm(product);
    this.prepareInterestForm(product);
    this.prepareFeeForm(product);
    this.prepareAllowanceForm(product);
  };

  @Input('currencies') currencies: Currency[];

  @Output('onSave') onSave = new EventEmitter<FimsProduct>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('settingsForm') settingsForm: ProductSettingsFormComponent;
  settingsFormData: SettingsFormData;

  @ViewChild('interestForm') interestForm: ProductInterestFormComponent;
  interestFormData: InterestFormData;

  @ViewChild('feeForm') feeForm: ProductFeeFormComponent;
  feeFormData: FeeFormData;

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.step.open();
  }

  get isValid(): boolean {
    return this.detailForm.valid &&
      this.settingsForm.valid &&
      this.interestForm.valid &&
      this.arrearsAllowanceForm.valid;
  }

  save(): void {
    const parameters: ProductParameters = {
      maximumDispersalAmount: 0,
      maximumDispersalCount: 0,
      moratoriums: []
    };

    const currencyCode: string = this.detailForm.get('currencyCode').value;

    const currency = this.currencies.find(currency => currency.code === currencyCode);

    const product: FimsProduct = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value,
      minorCurrencyUnitDigits: currency.digits,
      currencyCode: currency.code,
      interestBasis: this.interestForm.formData.interestBasis,
      termRange: {
        maximum: this.detailForm.get('term').value,
        temporalUnit: this.detailForm.get('temporalUnit').value
      },
      balanceRange: {
        minimum: parseFloat(this.detailForm.get('minimumBalance').value),
        maximum: parseFloat(this.detailForm.get('maximumBalance').value)
      },
      parameters: parameters,
      patternPackage: 'io.mifos.individuallending.api.v1',
      accountAssignments: this.collectAccountAssignments()
    };

    this.onSave.emit(product);
  }

  private collectAccountAssignments(): AccountAssignment[] {
    const assignments: AccountAssignment[] = [];

    assignments.push(createAccountAssignment(this.settingsForm.formData.loanFundAccount, AccountDesignators.LOAN_FUNDS_SOURCE));

    assignments.push(createLedgerAssignment(this.settingsForm.formData.loansPayableLedger, AccountDesignators.LOANS_PAYABLE));
    assignments.push(createLedgerAssignment(this.settingsForm.formData.customerLoanLedger, AccountDesignators.CUSTOMER_LOAN));
    assignments.push(createAccountAssignment(this.settingsForm.formData.pendingDisbursal, AccountDesignators.PENDING_DISBURSAL));

    assignments.push(createAccountAssignment(this.feeForm.formData.processingFeeAccount, AccountDesignators.PROCESSING_FEE_INCOME));
    assignments.push(createAccountAssignment(this.feeForm.formData.disbursementFeeAccount, AccountDesignators.DISBURSEMENT_FEE_INCOME));
    assignments.push(createAccountAssignment(this.feeForm.formData.lateFeeIncomeAccount, AccountDesignators.LATE_FEE_INCOME));
    assignments.push(createAccountAssignment(this.feeForm.formData.lateFeeAccrualAccount, AccountDesignators.LATE_FEE_ACCRUAL));
    assignments.push(createAccountAssignment(this.feeForm.formData.originationFeeAccount, AccountDesignators.ORIGINATION_FEE_INCOME));

    assignments.push(createAccountAssignment(this.interestForm.formData.incomeAccount, AccountDesignators.INTEREST_INCOME));
    assignments.push(createAccountAssignment(this.interestForm.formData.accrualAccount, AccountDesignators.INTEREST_ACCRUAL));

    assignments.push(createAccountAssignment(this.arrearsAllowanceForm.get('account').value, AccountDesignators.ARREARS_ALLOWANCE));

    return assignments;
  }

  cancel(): void{
    this.onCancel.emit();
  }

  prepareDetailForm(product: FimsProduct): void {
    const balanceRange = product.balanceRange;
    const termRange = product.termRange;

    this.detailForm = this.formBuilder.group({
      identifier: [product.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      name: [product.name, [Validators.required, Validators.maxLength(256)]],
      description: [product.description, [Validators.required, Validators.maxLength(4096)]],
      currencyCode: [product.currencyCode, [Validators.required]],
      minimumBalance: [balanceRange.minimum.toFixed(2), [Validators.required, FimsValidators.minValue(0)]],
      maximumBalance: [balanceRange.maximum.toFixed(2), [Validators.required, FimsValidators.minValue(0)]],
      term: [termRange ? termRange.maximum : undefined, [ Validators.required, FimsValidators.minValue(0) ]],
      temporalUnit: [termRange ? termRange.temporalUnit : undefined, Validators.required]
    }, { validator: FimsValidators.greaterThan('minimumBalance', 'maximumBalance') });
  }

  prepareSettingsForm(product: FimsProduct) {
    const loanFoundAccount = findAccountDesignator(product.accountAssignments, AccountDesignators.LOAN_FUNDS_SOURCE);
    const loansPayableLedger = findAccountDesignator(product.accountAssignments, AccountDesignators.LOANS_PAYABLE);
    const customerLoanLedger = findAccountDesignator(product.accountAssignments, AccountDesignators.CUSTOMER_LOAN);
    const pendingDisbursal = findAccountDesignator(product.accountAssignments, AccountDesignators.PENDING_DISBURSAL);

    this.settingsFormData = {
      loanFundAccount: accountIdentifier(loanFoundAccount),
      loansPayableLedger: ledgerIdentifier(loansPayableLedger),
      customerLoanLedger: ledgerIdentifier(customerLoanLedger),
      pendingDisbursal: accountIdentifier(pendingDisbursal)
    }
  }

  private prepareInterestForm(product: FimsProduct) {
    const interestIncome = findAccountDesignator(product.accountAssignments, AccountDesignators.INTEREST_INCOME);
    const interestAccrual = findAccountDesignator(product.accountAssignments, AccountDesignators.INTEREST_ACCRUAL);

    this.interestFormData = {
      interestBasis: product.interestBasis,
      incomeAccount: accountIdentifier(interestIncome),
      accrualAccount: accountIdentifier(interestAccrual)
    }
  }

  private prepareFeeForm(product: FimsProduct) {
    const processingFeeDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.PROCESSING_FEE_INCOME);
    const disbursementFeeDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.DISBURSEMENT_FEE_INCOME);
    const lateFeeIncomeDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.LATE_FEE_INCOME);
    const lateFeeAccrualDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.LATE_FEE_ACCRUAL);
    const loanOriginationFeeDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.ORIGINATION_FEE_INCOME);

    this.feeFormData = {
      disbursementFeeAccount: accountIdentifier(disbursementFeeDesignator),
      lateFeeIncomeAccount: accountIdentifier(lateFeeIncomeDesignator),
      lateFeeAccrualAccount: accountIdentifier(lateFeeAccrualDesignator),
      processingFeeAccount: accountIdentifier(processingFeeDesignator),
      originationFeeAccount: accountIdentifier(loanOriginationFeeDesignator)
    }
  }

  private prepareAllowanceForm(product: FimsProduct) {
    const allowanceDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.ARREARS_ALLOWANCE);
    this.arrearsAllowanceForm = this.formBuilder.group({
      account: [accountIdentifier(allowanceDesignator), [Validators.required], accountExists(this.accountingService)],
    });
  }

}
