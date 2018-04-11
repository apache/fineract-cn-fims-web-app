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

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PayrollCollectionSheet} from '../../../services/payroll/domain/payroll-collection-sheet.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {CustomerService} from '../../../services/customer/customer.service';
import {FimsValidators} from '../../../common/validator/validators';
import {TdStepComponent} from '@covalent/core';
import {customerWithConfigExists} from './validator/customer-payroll-exists.validator';
import {PayrollService} from '../../../services/payroll/payroll.service';

@Component({
  selector: 'fims-payroll-form',
  templateUrl: './form.component.html'
})
export class PayrollFormComponent implements OnInit {

  form: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Output() onSave = new EventEmitter<PayrollCollectionSheet>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService, private customerService: CustomerService,
              private payrollService: PayrollService) {
    this.form = this.formBuilder.group({
      sourceAccountNumber: ['', [Validators.required], accountExists(accountingService)],
      payments: this.initPayments()
    });
  }

  ngOnInit(): void {
    this.detailsStep.open();

    this.addPayment();
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
      customerIdentifier: ['', [Validators.required], customerWithConfigExists(this.customerService, this.payrollService)],
      employer: ['', [Validators.required]],
      salary: ['', [Validators.required, FimsValidators.minValue(0.001), FimsValidators.maxValue(9999999999.99999)]]
    });
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
