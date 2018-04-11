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
import {JournalEntry} from '../../../services/accounting/domain/journal-entry.model';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {addCurrentTime, parseDate} from '../../../services/domain/date.converter';
import {FimsValidators} from '../../../common/validator/validators';
import {Error} from '../../../services/domain/error.model';
import {JournalEntryValidators} from './journal-entry.validator';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {transactionTypeExists} from './transaction-type-select/validator/transaction-type-exists.validator';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {Creditor} from '../../../services/accounting/domain/creditor.model';
import {Debtor} from '../../../services/accounting/domain/debtor.model';

@Component({
  selector: 'fims-journal-entry-form',
  templateUrl: './form.component.html'
})
export class JournalEntryFormComponent implements OnInit, OnChanges {

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Input() journalEntry: JournalEntry;

  @Input() error: Error;

  @Output('onSave') onSave = new EventEmitter<JournalEntry>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {

    this.form = this.formBuilder.group({
      transactionIdentifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      transactionType: ['', [Validators.required], transactionTypeExists(this.accountingService)],
      transactionDate: ['', Validators.required],
      note: [''],
      message: [''],
      creditors: this.formBuilder.array([], JournalEntryValidators.minItems(1)),
      debtors: this.formBuilder.array([], JournalEntryValidators.minItems(1))
    }, { validator: JournalEntryValidators.equalSum('creditors', 'debtors') });

  }

  ngOnInit(): void {
    this.detailsStep.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.journalEntry) {
      this.form.reset({
        transactionIdentifier: this.journalEntry.transactionIdentifier,
        transactionType: this.journalEntry.transactionType,
        transactionDate: this.journalEntry.transactionDate,
        note: this.journalEntry.note,
        message: this.journalEntry.message
      });

      this.journalEntry.debtors.forEach(debtor => this.addDebtor(debtor));
      this.journalEntry.creditors.forEach(creditor => this.addCreditor(creditor));
    }

    if (changes.error) {
      this.form.get('transactionIdentifier').setErrors({
        unique: true
      });
      this.detailsStep.open();
    }
  }

  save(): void {
    const date: Date = parseDate(this.form.get('transactionDate').value);
    const dateWithTime = addCurrentTime(date);

    const journalEntry: JournalEntry = {
      transactionIdentifier: this.form.get('transactionIdentifier').value,
      transactionType: this.form.get('transactionType').value,
      transactionDate: dateWithTime.toISOString(),
      clerk: this.journalEntry.clerk,
      note: this.form.get('note').value,
      message: this.form.get('message').value,
      creditors: this.form.get('creditors').value,
      debtors: this.form.get('debtors').value,
    };

    this.onSave.emit(journalEntry);
  }

  addCreditor(creditor?: Creditor): void {
    const control: FormArray = this.form.get('creditors') as FormArray;
    control.push(this.initCreditor(creditor));
  }

  removeCreditor(index: number): void {
    const control: FormArray = this.form.get('creditors') as FormArray;
    control.removeAt(index);
  }

  addDebtor(debtor?: Debtor): void {
    const control: FormArray = this.form.get('debtors') as FormArray;
    control.push(this.initDebtor(debtor));
  }

  removeDebtor(index: number): void {
    const control: FormArray = this.form.get('debtors') as FormArray;
    control.removeAt(index);
  }

  cancel() {
    this.onCancel.emit();
  }

  get debtors(): AbstractControl[] {
    const debtors: FormArray = this.form.get('debtors') as FormArray;
    return debtors.controls;
  }

  get creditors(): AbstractControl[] {
    const creditors: FormArray = this.form.get('creditors') as FormArray;
    return creditors.controls;
  }

  private initCreditor(creditor: Creditor = { accountNumber: '', amount: '0' }): FormGroup {
    return this.formBuilder.group({
      accountNumber: [creditor.accountNumber, [Validators.required], accountExists(this.accountingService)],
      amount: [creditor.amount, [Validators.required, FimsValidators.greaterThanValue(0)]]
    });
  }

  private initDebtor(debtor: Debtor = { accountNumber: '', amount: '0' }): FormGroup {
    return this.formBuilder.group({
      accountNumber: [debtor.accountNumber, [Validators.required], accountExists(this.accountingService)],
      amount: [debtor.amount, [Validators.required, FimsValidators.greaterThanValue(0)]]
    });
  }

}
