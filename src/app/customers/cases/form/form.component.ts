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
import {CaseParameters} from '../../../../services/portfolio/domain/individuallending/case-parameters.model';
import {CaseDetailFormComponent, DetailFormData} from './detail/detail.component';
import {FimsCase} from '../store/model/fims-case.model';
import {CreditWorthinessSnapshot} from '../../../../services/portfolio/domain/individuallending/credit-worthiness-snapshot.model';
import {CaseDebtToIncomeFormComponent, DebtToIncomeFormData} from './debt-to-income/debt-to-income.component';
import {CaseCoSignerFormComponent, CoSignerFormData} from './co-signer/co-signer.component';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {CaseDocumentsFormComponent} from './documents/documents.component';

@Component({
  selector: 'fims-case-form-component',
  templateUrl: './form.component.html'
})
export class CaseFormComponent implements OnInit {

  private _caseInstance: FimsCase;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @ViewChild('detailForm') detailForm: CaseDetailFormComponent;
  detailFormData: DetailFormData;

  @ViewChild('debtToIncomeForm') debtToIncomeForm: CaseDebtToIncomeFormComponent;
  debtToIncomeFormData: DebtToIncomeFormData;

  @ViewChild('coSignerForm') coSignerForm: CaseCoSignerFormComponent;
  coSignerFormData: CoSignerFormData;

  @ViewChild('documentsForm') documentsForm: CaseDocumentsFormComponent;

  @Input('products') products: Product[];

  @Input('editMode') editMode: boolean;

  @Input('customerId') customerId: string;

  @Input('case') set caseInstance(caseInstance: FimsCase) {
    this._caseInstance = caseInstance;

    this.prepareDetailForm(caseInstance);
    this.prepareDeptToIncomeForm(caseInstance.parameters.creditWorthinessSnapshots);
    this.prepareCosignerForm(caseInstance.parameters.creditWorthinessSnapshots);
  };

  get caseInstance(): FimsCase {
    return this._caseInstance;
  }

  @Output('onSave') onSave = new EventEmitter<FimsCase>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    this.detailsStep.open();
  }

  private prepareDetailForm(caseInstance: FimsCase): void {
    this.detailFormData = {
      identifier: caseInstance.identifier,
      productIdentifier: caseInstance.productIdentifier,
      principalAmount: caseInstance.parameters.maximumBalance,
      term: caseInstance.parameters.termRange.maximum,
      termTemporalUnit: caseInstance.parameters.termRange.temporalUnit,
      paymentTemporalUnit: caseInstance.parameters.paymentCycle.temporalUnit,
      paymentPeriod: caseInstance.parameters.paymentCycle.period,
      paymentAlignmentDay: caseInstance.parameters.paymentCycle.alignmentDay,
      paymentAlignmentWeek: caseInstance.parameters.paymentCycle.alignmentWeek,
      paymentAlignmentMonth: caseInstance.parameters.paymentCycle.alignmentMonth
    };
  }

  private prepareDeptToIncomeForm(snapshots: CreditWorthinessSnapshot[]): void {
    const snapshot: CreditWorthinessSnapshot = snapshots.find(snapshot => snapshot.forCustomer === this.customerId);
    if(snapshot) {
      this.debtToIncomeFormData = {
        incomeSources: snapshot.incomeSources,
        debts: snapshot.debts
      };
    } else {
      this.debtToIncomeFormData = {
        incomeSources: [],
        debts: []
      }
    }
  }

  private prepareCosignerForm(snapshots: CreditWorthinessSnapshot[]): void {
    const snapshot: CreditWorthinessSnapshot = snapshots.find(snapshot => snapshot.forCustomer !== this.customerId);
    if(snapshot) {
      this.coSignerFormData = {
        customerId: snapshot.forCustomer,
        incomeSources: snapshot.incomeSources,
        debts: snapshot.debts
      };
    } else {
      this.coSignerFormData = {
        customerId: null,
        incomeSources: [],
        debts: []
      }
    }
  }

  get isValid(): boolean {
    return this.detailForm.valid &&
      this.debtToIncomeForm.valid &&
      this.coSignerForm.valid;
  }

  save(): void {
    const customerSnapshot: CreditWorthinessSnapshot = {
      forCustomer: this.customerId,
      incomeSources: this.debtToIncomeForm.formData.incomeSources,
      debts: this.debtToIncomeForm.formData.debts,
      assets: []
    };

    const cosignerSnapshot: CreditWorthinessSnapshot = {
      forCustomer: this.coSignerForm.formData.customerId,
      incomeSources: this.coSignerForm.formData.incomeSources,
      debts: this.coSignerForm.formData.debts,
      assets: []
    };

    const creditWorthinessSnapshots = [customerSnapshot];
    if(cosignerSnapshot.forCustomer) {
      creditWorthinessSnapshots.push(cosignerSnapshot);
    }

    const caseParameters: CaseParameters = {
      customerIdentifier: this.customerId,
      maximumBalance: this.detailForm.formData.principalAmount,
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
      },
      creditWorthinessSnapshots
    };

    const caseToSave: FimsCase = {
      currentState: this.caseInstance.currentState,
      identifier: this.detailForm.formData.identifier,
      productIdentifier: this.detailForm.formData.productIdentifier,
      parameters: caseParameters,
      accountAssignments: []
    };

    this.onSave.emit(caseToSave);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get detailFormState(): string {
    return this.detailForm.valid ? 'complete' : this.detailForm.pristine ? 'none' : 'required';
  }

  get debtToIncomeFormState(): string {
    return this.debtToIncomeForm.valid ? 'complete' : this.debtToIncomeForm.pristine ? 'none' : 'required';
  }

  get coSignerFormState(): string {
    return this.coSignerForm.valid ? 'complete' : this.coSignerForm.pristine ? 'none' : 'required';
  }

  get documentsFormState(): string {
    return this.documentsForm.valid ? 'complete' : this.documentsForm.pristine ? 'none' : 'required';
  }
}
