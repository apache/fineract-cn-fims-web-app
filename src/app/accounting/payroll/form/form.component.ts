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

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PayrollCollectionSheet} from '../../../services/accounting/domain/payroll-collection-sheet.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {CustomerService} from '../../../services/customer/customer.service';
import {customerExists} from '../../../common/validator/customer-exists.validator';
import {FimsValidators} from '../../../common/validator/validators';
import {TdStepComponent} from '@covalent/core';

@Component({
  selector: 'fims-payroll-form',
  templateUrl: './form.component.html'
})
export class PayrollFormComponent implements OnInit {

  form: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Output() onSave = new EventEmitter<PayrollCollectionSheet>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService, private customerService: CustomerService) {
    this.form = this.formBuilder.group({
      sourceAccountNumber: ['', [Validators.required], accountExists(accountingService)],
      payments: this.initPayments()
    });
  }

  ngOnInit(): void {
    this.detailsStep.open();
  }

  save(): void {
    const sheet: PayrollCollectionSheet = {
      sourceAccountNumber: this.form.get('sourceAccountNumber').value,
      payrollPayments: this.form.get('payments').value
    };

    this.onSave.emit(sheet);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  private initPayments(): FormArray {
    const formControls: FormGroup[] = [];
    return this.formBuilder.array(formControls);
  }

  private initPayment(): FormGroup {
    return this.formBuilder.group({
      customerIdentifier: ['', [Validators.required], customerExists(this.customerService)],
      employer: ['', [Validators.required]],
      salary: ['', [Validators.required, FimsValidators.minValue(0)]]
    })
  }

  addPayment(): void {
    const commands: FormArray = this.form.get('payments') as FormArray;
    commands.push(this.initPayment());
  }

  removePayment(index: number): void {
    const commands: FormArray = this.form.get('payments') as FormArray;
    commands.removeAt(index);
  }

  get payments(): AbstractControl[] {
    const commands: FormArray = this.form.get('payments') as FormArray;
    return commands.controls;
  }
}
