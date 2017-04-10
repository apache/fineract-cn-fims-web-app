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
import {TdStepComponent} from '@covalent/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CaseParameters} from '../../../../services/portfolio/domain/individuallending/case-parameters.model';
import {AccountAssignment} from '../../../../services/portfolio/domain/account-assignment.model';
import {AccountDesignators} from '../../../../services/portfolio/domain/individuallending/account-designators.model';
import {CaseDetailFormComponent, DetailFormData} from './detail/detail.component';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {setSelections} from '../../../../components/forms/form-helper';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import {LOAD_PRODUCT, UNLOAD_PRODUCT} from '../store/case.actions';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {Observable} from 'rxjs/Observable';
import {FimsCase} from '../store/model/fims-case.model';
import {accountExists} from '../../../../components/validator/account-exists.validator';

@Component({
  selector: 'fims-case-form-component',
  templateUrl: './form.component.html'
})
export class CaseFormComponent implements OnInit{

  private _caseInstance: FimsCase;

  selectedProduct: Observable<Product>;

  productForm: FormGroup;

  savingsForm: FormGroup;

  @ViewChild('productSelection') productStep: TdStepComponent;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @ViewChild('detailForm') detailForm: CaseDetailFormComponent;
  detailFormData: DetailFormData;

  @Input('editMode') editMode: boolean;

  @Input('customerId') customerId: string;

  @Input('case') set caseInstance(caseInstance: FimsCase){
    this._caseInstance = caseInstance;

    this.prepareProductForm(caseInstance);
    this.prepareDetailForm(caseInstance);
  };

  get caseInstance(): FimsCase {
    return this._caseInstance;
  }

  @Output('onSave') onSave = new EventEmitter<FimsCase>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.productStep.open();

    this.selectedProduct = this.casesStore.select(fromCases.getCaseFormProduct);
  }

  private prepareProductForm(caseInstance: FimsCase): void {
    this.productForm = this.formBuilder.group({
      identifier: [caseInstance.productIdentifier, [Validators.required]]
    });
  }

  private prepareDetailForm(caseInstance: FimsCase): void {
    this.detailFormData = {
      identifier: caseInstance.identifier,
      principalAmount: caseInstance.parameters.initialBalance,
      term: caseInstance.parameters.termRange.maximum,
      termTemporalUnit: caseInstance.parameters.termRange.temporalUnit,
      paymentTemporalUnit: caseInstance.parameters.paymentCycle.temporalUnit,
      paymentPeriod: caseInstance.parameters.paymentCycle.period,
      paymentAlignmentDay: caseInstance.parameters.paymentCycle.alignmentDay,
      paymentAlignmentWeek: caseInstance.parameters.paymentCycle.alignmentWeek,
      paymentAlignmentMonth: caseInstance.parameters.paymentCycle.alignmentMonth
    };
  }

  onProductSelection(selections: string[]): void {
    setSelections('identifier', this.productForm, selections);

    if(selections.length === 1) {
      this.casesStore.dispatch({ type: LOAD_PRODUCT, payload: selections[0] });
    }else{
      this.casesStore.dispatch({ type: UNLOAD_PRODUCT });
    }
  }

  get isValid(): boolean{
    return this.productForm.valid
      && this.detailForm.valid;
  }

  private collectAccountAssignments(): AccountAssignment[]{
    let assignments: AccountAssignment[] = [];

    assignments.push({
      accountIdentifier: 'placeholder',
      designator: AccountDesignators.CUSTOMER_LOAN
    });

    return assignments;
  }

  save(): void{
    let caseParameters: CaseParameters = {
      customerIdentifier: this.customerId,
      balanceRange: {
        minimum: 0,
        maximum: this.detailForm.formData.principalAmount
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

    let caseToSave: FimsCase = {
      currentState: this.caseInstance.currentState,
      identifier: this.detailForm.formData.identifier,
      productIdentifier: this.productForm.get('identifier').value,
      parameters: caseParameters,
      accountAssignments: this.collectAccountAssignments()
    };
    this.onSave.emit(caseToSave);
  }

  cancel(): void{
    this.onCancel.emit();
  }


}
