/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {InterestFormData, ProductInterestFormComponent} from './interests/interests.component';
import {AccountAssignment} from '../../../services/portfolio/domain/account-assignment.model';
import {AccountDesignators} from '../../../services/portfolio/domain/individuallending/account-designators.model';
import {FeeFormData, ProductFeeFormComponent} from './fees/fee.component';
import {ProductParameters} from '../../../services/portfolio/domain/individuallending/product-parameters.model';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {FimsProduct} from '../store/model/fims-product.model';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {ProductSettingsFormComponent, SettingsFormData} from './settings/settings.component';
import {temporalOptionList} from '../../../common/domain/temporal.domain';
import {Currency} from '../../../services/currency/domain/currency.model';
import {
  accountIdentifier,
  createAccountAssignment,
  createLedgerAssignment,
  findAccountDesignator,
  ledgerIdentifier
} from '../../../common/util/account-assignments';
import {DetailFormData, ProductDetailFormComponent} from './detail/detail.component';
import {Error} from '../../../services/domain/error.model';

@Component({
  selector: 'fims-product-form-component',
  templateUrl: './form.component.html'
})
export class ProductFormComponent implements OnInit {

  private _error: Error;

  temporalOptions = temporalOptionList;

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

  @Input('error') set error(error: Error) {
    this._error = error;
    this.step.open();
  };

  @Output('onSave') onSave = new EventEmitter<FimsProduct>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('detailForm') detailForm: ProductDetailFormComponent;
  detailFormData: DetailFormData;

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
      this.feeForm.valid &&
      this.arrearsAllowanceForm.valid;
  }

  save(): void {
    const parameters: ProductParameters = {
      minimumDispersalAmount: 0,
      maximumDispersalAmount: 0,
      maximumDispersalCount: 0,
      moratoriums: []
    };

    const foundCurrency = this.currencies.find(currency => currency.code === this.detailForm.formData.currencyCode);

    const product: FimsProduct = {
      identifier: this.detailForm.formData.identifier,
      name: this.detailForm.formData.name,
      description: this.detailForm.formData.description,
      minorCurrencyUnitDigits: foundCurrency.digits,
      currencyCode: foundCurrency.code,
      interestBasis: 'CURRENT_BALANCE',
      interestRange: {
        minimum: parseFloat(this.interestForm.formData.minimum),
        maximum: parseFloat(this.interestForm.formData.maximum),
      },
      termRange: {
        maximum: this.detailForm.formData.term,
        temporalUnit: this.detailForm.formData.temporalUnit
      },
      balanceRange: {
        minimum: parseFloat(this.detailForm.formData.minimumBalance),
        maximum: parseFloat(this.detailForm.formData.maximumBalance)
      },
      parameters,
      patternPackage: 'org.apache.fineract.cn.individuallending.api.v1',
      accountAssignments: this.collectAccountAssignments()
    };

    this.onSave.emit(product);
  }

  private collectAccountAssignments(): AccountAssignment[] {
    const assignments: AccountAssignment[] = [];

    assignments.push(createAccountAssignment(this.settingsForm.formData.loanFundAccount, AccountDesignators.LOAN_FUNDS_SOURCE));

    assignments.push(createLedgerAssignment(this.settingsForm.formData.customerLoanLedger, AccountDesignators.CUSTOMER_LOAN_PRINCIPAL));
    assignments.push(createLedgerAssignment(this.settingsForm.formData.customerLoanLedger, AccountDesignators.CUSTOMER_LOAN_INTEREST));
    assignments.push(createLedgerAssignment(this.settingsForm.formData.customerLoanLedger, AccountDesignators.CUSTOMER_LOAN_FEES));

    assignments.push(createLedgerAssignment(this.settingsForm.formData.customerLoanLedger, AccountDesignators.CUSTOMER_LOAN_FEES));

    assignments.push(createAccountAssignment(this.feeForm.formData.processingFeeAccount, AccountDesignators.PROCESSING_FEE_INCOME));
    assignments.push(createAccountAssignment(this.feeForm.formData.disbursementFeeAccount, AccountDesignators.DISBURSEMENT_FEE_INCOME));
    assignments.push(createAccountAssignment(this.feeForm.formData.lateFeeIncomeAccount, AccountDesignators.LATE_FEE_INCOME));
    assignments.push(createAccountAssignment(this.feeForm.formData.lateFeeAccrualAccount, AccountDesignators.LATE_FEE_ACCRUAL));
    assignments.push(createAccountAssignment(this.feeForm.formData.originationFeeAccount, AccountDesignators.ORIGINATION_FEE_INCOME));

    assignments.push(createAccountAssignment(this.interestForm.formData.incomeAccount, AccountDesignators.INTEREST_INCOME));
    assignments.push(createAccountAssignment(this.interestForm.formData.accrualAccount, AccountDesignators.INTEREST_ACCRUAL));

    assignments.push(createAccountAssignment(this.arrearsAllowanceForm.get('account').value, AccountDesignators.GENERAL_LOSS_ALLOWANCE));

    return assignments;
  }

  cancel(): void {
    this.onCancel.emit();
  }

  prepareDetailForm(product: FimsProduct): void {
    this.detailFormData = {
      identifier: product.identifier,
      name: product.name,
      description: product.description,
      currencyCode: product.currencyCode,
      minimumBalance: product.balanceRange.minimum.toFixed(2),
      maximumBalance: product.balanceRange.maximum.toFixed(2),
      term: product.termRange.maximum,
      temporalUnit: product.termRange.temporalUnit
    };
  }

  prepareSettingsForm(product: FimsProduct) {
    const loanFoundAccount = findAccountDesignator(product.accountAssignments, AccountDesignators.LOAN_FUNDS_SOURCE);
    const customerLoanLedger = findAccountDesignator(product.accountAssignments, AccountDesignators.CUSTOMER_LOAN_PRINCIPAL);

    this.settingsFormData = {
      loanFundAccount: accountIdentifier(loanFoundAccount),
      customerLoanLedger: ledgerIdentifier(customerLoanLedger),
    };
  }

  private prepareInterestForm(product: FimsProduct) {
    const interestIncome = findAccountDesignator(product.accountAssignments, AccountDesignators.INTEREST_INCOME);
    const interestAccrual = findAccountDesignator(product.accountAssignments, AccountDesignators.INTEREST_ACCRUAL);
    const interestRange = product.interestRange;

    this.interestFormData = {
      minimum: interestRange.minimum.toFixed(2),
      maximum: interestRange.maximum.toFixed(2),
      incomeAccount: accountIdentifier(interestIncome),
      accrualAccount: accountIdentifier(interestAccrual)
    };
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
    };
  }

  private prepareAllowanceForm(product: FimsProduct) {
    const allowanceDesignator = findAccountDesignator(product.accountAssignments, AccountDesignators.GENERAL_LOSS_ALLOWANCE);
    this.arrearsAllowanceForm = this.formBuilder.group({
      account: [accountIdentifier(allowanceDesignator), [Validators.required], accountExists(this.accountingService)],
    });
  }

  get error(): Error {
    return this._error;
  }

}
