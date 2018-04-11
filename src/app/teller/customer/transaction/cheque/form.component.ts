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
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {TdStepComponent} from '@covalent/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {TellerTransactionCosts} from '../../../../services/teller/domain/teller-transaction-costs.model';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {TransactionForm} from '../domain/transaction-form.model';
import {toMICRIdentifier} from '../../../../services/cheque/domain/mapper/fims-cheque.mapper';
import {Cheque} from '../../../../services/teller/domain/cheque.model';
import {MICRResolution} from '../../../../services/cheque/domain/micr-resolution.model';
import {toShortISOString} from '../../../../services/domain/date.converter';

@Component({
  selector: 'fims-cheque-transaction-form',
  templateUrl: './form.component.html'
})
export class ChequeTransactionFormComponent implements OnInit, OnChanges {

  chequeForm: FormGroup;
  amountForm: FormGroup;

  chargesIncluded = true;

  numberFormat = '1.2-2';

  @ViewChild('transactionStep') transactionStep: TdStepComponent;
  @ViewChild('confirmationStep') confirmationStep: TdStepComponent;

  @Input('productInstances') productInstances: ProductInstance[];
  @Input('transactionCosts') transactionCosts: TellerTransactionCosts;
  @Input('transactionCreated') transactionCreated: boolean;
  @Input('micrResolution') micrResolution: MICRResolution;
  @Input('micrResolutionError') micrResolutionError: Error;
  @Input('customerName') customerName: string;

  @Output('onExpandMICR') onExpandMICR = new EventEmitter<string>();
  @Output('onCreateTransaction') onCreateTransaction = new EventEmitter<TransactionForm>();
  @Output('onConfirmTransaction') onConfirmTransaction = new EventEmitter<boolean>();
  @Output('onCancelTransaction') onCancelTransaction = new EventEmitter<void>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.chequeForm = this.formBuilder.group({
      chequeNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8), FimsValidators.isNumber]],
      branchSortCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(11)]],
      accountNumber: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(34)]]
    });

    this.amountForm = this.formBuilder.group({
      productInstance: ['', Validators.required],
      drawee: ['', Validators.required],
      drawer: ['', Validators.required],
      payee: [{value: '', disabled: true}, Validators.required],
      amount: ['', [Validators.required, FimsValidators.greaterThanValue(0)]],
      dateIssued: ['', [Validators.required]],
      openCheque: [false],
    });
  }

  ngOnInit(): void {
    this.transactionStep.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const draweeControl = this.amountForm.get('drawee');
    const drawerControl = this.amountForm.get('drawer');

    if (changes.micrResolution && this.micrResolution) {
      draweeControl.setValue(this.micrResolution.office);
      drawerControl.setValue(this.micrResolution.customer);
    }

    if (changes.micrResolutionError && this.micrResolutionError) {
      draweeControl.setValue('');
      drawerControl.setValue('');
    }

    if (changes.transactionCreated && this.transactionCreated) {
      this.confirmationStep.open();
    }

    if (changes.customerName) {
      this.amountForm.get('payee').setValue(this.customerName);
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }

  validateCheque(): void {
    const chequeNumber = this.chequeForm.get('chequeNumber').value;
    const branchSortCode = this.chequeForm.get('branchSortCode').value;
    const accountNumber = this.chequeForm.get('accountNumber').value;
    this.onExpandMICR.emit(toMICRIdentifier(chequeNumber, branchSortCode, accountNumber));
  }

  createTransaction(): void {
    const productInstance: ProductInstance = this.amountForm.get('productInstance').value;

    const cheque: Cheque = {
      micr: {
        chequeNumber: this.chequeForm.get('chequeNumber').value,
        branchSortCode: this.chequeForm.get('branchSortCode').value,
        accountNumber: this.chequeForm.get('accountNumber').value
      },
      drawee: this.amountForm.get('drawee').value,
      drawer: this.amountForm.get('drawer').value,
      payee: this.amountForm.get('payee').value,
      amount: this.amountForm.get('amount').value,
      dateIssued: toShortISOString(this.amountForm.get('dateIssued').value),
      openCheque: this.amountForm.get('openCheque').value
    };

    const formData: TransactionForm = {
      productIdentifier: productInstance.productIdentifier,
      accountIdentifier: productInstance.accountIdentifier,
      customerIdentifier: productInstance.customerIdentifier,
      amount: this.amountForm.get('amount').value,
      cheque
    };

    this.onCreateTransaction.emit(formData);
  }

  confirmTransaction(chargesIncluded: boolean): void {
    this.onConfirmTransaction.emit(chargesIncluded);
  }

  cancelTransaction(): void {
    this.onCancelTransaction.emit();
  }

  get createTransactionDisabled(): boolean {
    return this.invalid || this.transactionCreated;
  }

  get invalid(): boolean {
    return this.chequeForm.invalid || this.amountForm.invalid;
  }

}
