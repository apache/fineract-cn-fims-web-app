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

import {OnInit, Component, EventEmitter, Output, Input, ViewChild} from '@angular/core';
import {TdStepComponent} from '@covalent/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Case} from '../../../../services/portfolio/domain/case.model';
import {CaseParameters} from '../../../../services/portfolio/domain/individuallending/case-parameters.model';
import {AccountAssignment} from '../../../../services/portfolio/domain/account-assignment.model';
import {AccountDesignators} from '../../../../services/portfolio/domain/individuallending/account-designators.model';
import {CaseDetailFormComponent, DetailFormData} from './detail/detail.component';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {accountExists} from '../../../../components/account-exists.validator';
import {setSelections} from '../../../../components/forms/form-helper';

@Component({
  selector: 'fims-case-form-component',
  templateUrl: './form.component.html'
})
export class CaseFormComponent implements OnInit{

  productForm: FormGroup;

  savingsForm: FormGroup;

  @ViewChild('productSelection') productStep: TdStepComponent;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @ViewChild('detailForm') detailForm: CaseDetailFormComponent;
  detailFormData: DetailFormData;

  @Input('editMode') editMode: boolean;

  @Input('customerId') customerId: string;

  @Input('case') set caseInstance(caseInstance: Case){
    this.prepareProductForm(caseInstance);
    this.preparePaymentsForm(caseInstance);
    this.prepareSavingsForm(caseInstance);
  };

  @Output('onSave') onSave = new EventEmitter<Case>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.productStep.open();
  }

  private prepareProductForm(caseInstance: Case): void{
    this.productForm = this.formBuilder.group({
      identifier: [caseInstance.productIdentifier, [Validators.required]]
    });
  }

  private preparePaymentsForm(caseInstance: Case): void{
    let parameters = this.parseParameter(caseInstance.parameters);

    this.detailFormData = {
      identifier: caseInstance.identifier,
      principalAmount: parameters.initialBalance,
      term: parameters.termRange.maximum,
      termTemporalUnit: parameters.termRange.temporalUnit,
      paymentTemporalUnit: parameters.paymentCycle.temporalUnit,
      paymentPeriod: parameters.paymentCycle.period,
      paymentAlignmentDay: parameters.paymentCycle.alignmentDay,
      paymentAlignmentWeek: parameters.paymentCycle.alignmentWeek,
      paymentAlignmentMonth: parameters.paymentCycle.alignmentMonth
    };
  }

  private prepareSavingsForm(caseInstance: Case) {
    let designator = caseInstance.accountAssignments.find(assignment => assignment.designator === AccountDesignators.CUSTOMER_LOAN);
    this.savingsForm = this.formBuilder.group({
      savingsAccount: [designator ? designator.accountIdentifier : undefined, [Validators.required], accountExists(this.accountingService)]
    });
  }

  private parseParameter(parameters: string): CaseParameters{
    return JSON.parse(parameters);
  }

  onProductSelection(selections: string[]): void{
    setSelections('identifier', this.productForm, selections);
  }

  get isValid(): boolean{
    return this.productForm.valid && this.detailForm.valid && this.savingsForm.valid;
  }

  private collectAccountAssignments(): AccountAssignment[]{
    let assignments: AccountAssignment[] = [];

    assignments.push({
      accountIdentifier: this.savingsForm.get('savingsAccount').value,
      designator: AccountDesignators.CUSTOMER_LOAN
    });

    return assignments;
  }

  save(): void{
    let caseParameters: CaseParameters = {
      customerIdentifier: this.customerId,
      balanceRange: {
        minimum: 0,
        maximum: 100
      },
      initialBalance: this.detailForm.formData.principalAmount,
      paymentCycle: {
        alignmentDay: this.detailForm.formData.paymentAlignmentDay,
        alignmentMonth: this.detailForm.formData.paymentAlignmentMonth,
        alignmentWeek: this.detailForm.formData.paymentAlignmentWeek,
        period: this.detailForm.formData.paymentPeriod,
        temporalUnit: this.detailForm.formData.paymentTemporalUnit
      },
      termRange: {
        temporalUnit: this.detailForm.formData.termTemporalUnit,
        maximum: this.detailForm.formData.term
      }
    };
    let caseInstance: Case = {
      identifier: this.detailForm.formData.identifier,
      productIdentifier: this.productForm.get('identifier').value,
      parameters: JSON.stringify(caseParameters),
      accountAssignments: this.collectAccountAssignments(),
    };
    this.onSave.emit(caseInstance);
  }

  cancel(): void{
    this.onCancel.emit();
  }


}
