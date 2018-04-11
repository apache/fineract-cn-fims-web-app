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
import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Charge} from '../../../services/depositAccount/domain/definition/charge.model';
import {FormComponent} from '../../../common/forms/form.component';
import {Action} from '../../../services/depositAccount/domain/definition/action.model';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {FimsValidators} from '../../../common/validator/validators';

@Component({
  selector: 'fims-deposit-product-charges-form',
  templateUrl: './charges.component.html'
})
export class DepositProductChargesFormComponent extends FormComponent<Charge[]> {

  @Input('actions') actions: Action[];

  @Input('formData') set formData(charges: Charge[]) {
    charges = charges || [];
    this.form = this.formBuilder.group({
      charges: this.initCharges(charges),
    });
  }

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    super();
  }

  get formData(): Charge[] {
    const charges = this.form.get('charges').value;

    return charges.map(charge => Object.assign({}, charge, {
      amount: parseFloat(charge.amount)
    }));
  }

  private initCharges(charges: Charge[]): FormArray {
    const formControls: FormGroup[] = [];
    charges.forEach(charge => formControls.push(this.initCharge(charge)));
    return this.formBuilder.array(formControls);
  }

  private initCharge(charge?: Charge): FormGroup {
    const amount = charge ? charge.amount : 0;

    return this.formBuilder.group({
      actionIdentifier: [charge ? charge.actionIdentifier : '', Validators.required],
      incomeAccountIdentifier: [charge ? charge.incomeAccountIdentifier : '', [Validators.required], accountExists(this.accountingService)],
      name: [charge ? charge.name : '', [Validators.required, Validators.maxLength(256)]],
      description: [charge ? charge.description : '', Validators.maxLength(2048)],
      proportional: [charge ? charge.proportional : false ],
      amount: [amount.toFixed(2), [ FimsValidators.minValue(0)] ]
    });
  }

  addCharge(): void {
    const charges: FormArray = this.form.get('charges') as FormArray;
    charges.push(this.initCharge());
  }

  removeCharge(index: number): void {
    const charges: FormArray = this.form.get('charges') as FormArray;
    charges.removeAt(index);
  }

  get charges(): AbstractControl[] {
    const charges: FormArray = this.form.get('charges') as FormArray;
    return charges.controls;
  }

  getFormGroup(index: number): FormGroup {
    const charges = this.form.get('charges') as FormArray;
    return charges.at(index) as FormGroup;
  }
}
