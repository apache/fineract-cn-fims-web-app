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
import {TransactionForm} from '../domain/transaction-form.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {FimsCase} from '../../../../services/portfolio/domain/fims-case.model';
import {TellerTransactionCosts} from '../../../../services/teller/domain/teller-transaction-costs.model';
import {TdStepComponent} from '@covalent/core';

@Component({
  selector: 'fims-loan-transaction-form',
  templateUrl: './form.component.html'
})
export class LoanTransactionFormComponent implements OnInit {

  private _transactionCreated: boolean;

  chargesIncluded: boolean = true;

  form: FormGroup;

  @Input() caseInstances: FimsCase[];

  @Input('transactionCosts') transactionCosts: TellerTransactionCosts;

  @Input('transactionCreated') set transactionCreated(transactionCreated: boolean) {
    this._transactionCreated = transactionCreated;
    if(transactionCreated) {
      this.confirmationStep.open();
    }
  };

  @Output('onCreateTransaction') onCreateTransaction = new EventEmitter<TransactionForm>();

  @Output('onConfirmTransaction') onConfirmTransaction = new EventEmitter<boolean>();

  @Output('onCancelTransaction') onCancelTransaction = new EventEmitter<void>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('confirmationStep') confirmationStep: TdStepComponent;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      caseInstance: ['', Validators.required],
      amount: ['', [Validators.required, FimsValidators.minValue(0)]]
    });
  }

  createTransaction(): void {
    const fimsCase: FimsCase = this.form.get('caseInstance').value;

    const formData: TransactionForm = {
      productIdentifier: fimsCase.productIdentifier,
      productCaseIdentifier: fimsCase.identifier,
      accountIdentifier: fimsCase.customerLoanAccountIdentifier,
      customerIdentifier: fimsCase.parameters.customerIdentifier,
      amount: this.form.get('amount').value
    };

    this.onCreateTransaction.emit(formData);
  }

  confirmTransaction(chargesIncluded: boolean): void {
    this.onConfirmTransaction.emit(chargesIncluded);
  }

  cancelTransaction(): void {
    this.onCancelTransaction.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get transactionCreated(): boolean {
    return this._transactionCreated;
  }
}
