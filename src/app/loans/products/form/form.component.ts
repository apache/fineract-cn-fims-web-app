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
import {Product} from '../../../../services/portfolio/domain/product.model';
import {InterestFormData, ProductInterestFormComponent} from './interests/interests.component';
import {AccountAssignment} from '../../../../services/portfolio/domain/account-assignment.model';
import {AccountDesignators} from '../../../../services/portfolio/domain/individuallending/account-designators.model';
import {FeeFormData, ProductFeeFormComponent} from './fees/fee.component';
import {ProductTermFormComponent, TermRangeFormData} from '../components/term/term.component';
import {ProductParameters} from '../../../../services/portfolio/domain/individuallending/product-parameters.model';
import {ProductMoratoriumFormComponent} from './moratorium/moratorium.component';
import {Moratorium} from '../../../../services/portfolio/domain/individuallending/moratorium.model';
import {FimsValidators} from '../../../../components/validators';
import {accountExists} from '../../../../components/account-exists.validator';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {FimsProduct} from '../store/model/fims-product.model';

@Component({
  selector: 'fims-product-form-component',
  templateUrl: './form.component.html'
})
export class ProductFormComponent implements OnInit{

  currencyUnitDigits: any = [
    { digits: 0, label: '0' },
    { digits: 1, label: '1' },
    { digits: 2, label: '2' },
    { digits: 3, label: '3' },
    { digits: 4, label: '4' }
  ];

  detailForm: FormGroup;

  arrearsAllowanceForm: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input('editMode') editMode: boolean;

  @Input('product') set product(product: FimsProduct){
    this.prepareDetailForm(product);
    this.prepareTermForm(product);
    this.prepareInterestForm(product);
    this.prepareFeeForm(product);
    this.prepareAllowanceForm(product);
    this.prepareMoratoriumForm(product);
  };

  @Output('onSave') onSave = new EventEmitter<Product>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('termForm') termForm: ProductTermFormComponent;
  private termFormData: TermRangeFormData;

  @ViewChild('interestForm') interestForm: ProductInterestFormComponent;
  private interestFormData: InterestFormData;

  @ViewChild('moratoriumForm') moratoriumForm: ProductMoratoriumFormComponent;
  private moratoriumFormData: Moratorium[];

  @ViewChild('feeForm') feeForm: ProductFeeFormComponent;
  private feeFormData: FeeFormData;

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {}

  ngOnInit(): void{
    this.step.open();
  }

  get isValid(): boolean {
    return this.detailForm.valid &&
      this.termForm.valid &&
      this.interestForm.valid &&
      this.arrearsAllowanceForm.valid &&
      this.moratoriumForm.validWhenOptional;
  }

  save(): void{
    let parameters = {
      maximumDispersalAmount: this.detailForm.get('dispersalAmount').value,
      maximumDispersalCount: this.detailForm.get('dispersalCount').value,
      moratoriums: this.moratoriumForm.formData
    };

    let product: Product = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value,
      minorCurrencyUnitDigits: this.detailForm.get('minorCurrencyUnitDigits').value,
      currencyCode: this.detailForm.get('currencyCode').value,
      interestBasis: this.interestForm.formData.interestBasis,
      interestRange: {
        minimum: this.interestForm.formData.minimum,
        maximum: this.interestForm.formData.maximum,
      },
      termRange: {
        maximum: this.termForm.formData.term,
        temporalUnit: this.termForm.formData.temporalUnit,
      },
      balanceRange: {
        minimum: this.detailForm.get('minimumBalance').value,
        maximum: this.detailForm.get('maximumBalance').value
      },
      parameters: JSON.stringify(parameters),
      patternPackage: 'io.mifos.individuallending.api.v1',
      accountAssignments: this.collectAccountAssignments()
    };
    this.onSave.emit(product);
  }

  private collectAccountAssignments(): AccountAssignment[]{
    let assignments: AccountAssignment[] = [];

    assignments.push(this.createAssignment(this.feeForm.formData.processingFeeAccount, AccountDesignators.PROCESSING_FEE_INCOME));
    assignments.push(this.createAssignment(this.feeForm.formData.disbursementFeeAccount, AccountDesignators.DISBURSEMENT_FEE_INCOME));
    assignments.push(this.createAssignment(this.feeForm.formData.lateFeeIncomeAccount, AccountDesignators.LATE_FEE_INCOME));
    assignments.push(this.createAssignment(this.feeForm.formData.lateFeeAccrualAccount, AccountDesignators.LATE_FEE_ACCRUAL));
    assignments.push(this.createAssignment(this.feeForm.formData.originationFeeAccount, AccountDesignators.ORIGINATION_FEE_INCOME));

    assignments.push(this.createAssignment(this.interestForm.formData.incomeAccount, AccountDesignators.INTEREST_INCOME));
    assignments.push(this.createAssignment(this.interestForm.formData.accrualAccount, AccountDesignators.INTEREST_ACCRUAL));

    assignments.push(this.createAssignment(this.arrearsAllowanceForm.get('account').value, AccountDesignators.ARREARS_ALLOWANCE));

    return assignments;
  }

  private createAssignment(identifier: string, designator: string): AccountAssignment{
    return {
      accountIdentifier: identifier,
      designator: designator
    }
  }

  cancel(): void{
    this.onCancel.emit();
  }

  prepareDetailForm(product: FimsProduct): void{
    let balanceRange = product.balanceRange;
    this.detailForm = this.formBuilder.group({
      identifier: [product.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      name: [product.name, [Validators.required]],
      description: [product.description, [Validators.required]],
      currencyCode: [product.currencyCode, [Validators.required]],
      minorCurrencyUnitDigits: [product.minorCurrencyUnitDigits, [Validators.required]],
      minimumBalance: [balanceRange ? balanceRange.minimum : undefined, [Validators.required, FimsValidators.minValue(0)]],
      maximumBalance: [balanceRange ? balanceRange.maximum : undefined, [Validators.required, FimsValidators.minValue(0)]],
      multipleDispersals: [''],
      dispersalAmount: [product.parameters.maximumDispersalAmount],
      dispersalCount: [product.parameters.maximumDispersalCount],
    }, { validator: FimsValidators.greaterThan('minimumBalance', 'maximumBalance') });
  }

  private prepareInterestForm(product: FimsProduct) {
    let interestIncome = this.findAccountDesignator(product.accountAssignments, AccountDesignators.INTEREST_INCOME);
    let interestAccrual = this.findAccountDesignator(product.accountAssignments, AccountDesignators.INTEREST_ACCRUAL);
    let interestRange = product.interestRange;
    this.interestFormData = {
      minimum: interestRange ? interestRange.minimum : 0,
      maximum: interestRange ? interestRange.maximum : 0,
      interestBasis: product.interestBasis,
      incomeAccount: this.accountIdentifier(interestIncome),
      accrualAccount: this.accountIdentifier(interestAccrual)
    }
  }

  private prepareMoratoriumForm(product: FimsProduct) {
    this.moratoriumFormData = product.parameters.moratoriums;
  }

  private parseParameter(parameters: string): ProductParameters{
    return JSON.parse(parameters);
  }

  private prepareFeeForm(product: FimsProduct) {
    let processingFeeDesignator = this.findAccountDesignator(product.accountAssignments, AccountDesignators.PROCESSING_FEE_INCOME);
    let disbursementFeeDesignator = this.findAccountDesignator(product.accountAssignments, AccountDesignators.DISBURSEMENT_FEE_INCOME);
    let lateFeeIncomeDesignator = this.findAccountDesignator(product.accountAssignments, AccountDesignators.LATE_FEE_INCOME);
    let lateFeeAccrualDesignator = this.findAccountDesignator(product.accountAssignments, AccountDesignators.LATE_FEE_ACCRUAL);
    let loanOriginationFeeDesignator = this.findAccountDesignator(product.accountAssignments, AccountDesignators.ORIGINATION_FEE_INCOME);

    this.feeFormData = {
      disbursementFeeAccount: this.accountIdentifier(disbursementFeeDesignator),
      lateFeeIncomeAccount: this.accountIdentifier(lateFeeIncomeDesignator),
      lateFeeAccrualAccount: this.accountIdentifier(lateFeeAccrualDesignator),
      processingFeeAccount: this.accountIdentifier(processingFeeDesignator),
      originationFeeAccount: this.accountIdentifier(loanOriginationFeeDesignator)
    }
  }
  private prepareTermForm(product: FimsProduct) {
    let termRange = product.termRange;
    this.termFormData = {
      term: termRange ? termRange.maximum : undefined,
      temporalUnit: termRange ? termRange.temporalUnit : undefined
    }
  }

  private prepareAllowanceForm(product: FimsProduct) {
    let allowanceDesignator = this.findAccountDesignator(product.accountAssignments, AccountDesignators.ARREARS_ALLOWANCE);
    this.arrearsAllowanceForm = this.formBuilder.group({
      account: [this.accountIdentifier(allowanceDesignator), [Validators.required], accountExists(this.accountingService)],
    });
  }

  private accountIdentifier(assignment: AccountAssignment): string{
    return assignment ? assignment.accountIdentifier : undefined;
  }

  private findAccountDesignator(accountAssignments: AccountAssignment[], designator: string): AccountAssignment{
    let result = accountAssignments.filter(assignment => assignment.designator === designator);
    if(result.length){
      return result[0];
    }
  }

}
