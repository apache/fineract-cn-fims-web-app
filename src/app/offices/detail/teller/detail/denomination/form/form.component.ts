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
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../../common/validator/validators';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TellerDenomination} from '../../../../../../services/teller/domain/teller-denomination.model';
import {TellerBalanceSheet} from '../../../../../../services/teller/domain/teller-balance-sheet.model';

interface Detail {
  label: string;
  value: string;
  units: string;
  totalValue: string;
}

@Component({
  selector: 'fims-denomination-form-component',
  templateUrl: './form.component.html'
})
export class DenominationFormComponent {

  form: FormGroup;

  @Input() balanceSheet: TellerBalanceSheet;

  @Output() onSave = new EventEmitter<TellerDenomination>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      note: [''],
      details: formBuilder.array([])
    });

    this.addDetail();
  }

  initDetail(): FormGroup {
    return this.formBuilder.group({
      value: ['', [Validators.required, FimsValidators.minValue(0)]],
      count: ['', [Validators.required, FimsValidators.minValue(0)]]
    });
  }

  addDetail(): void {
    const options: FormArray = this.form.get('details') as FormArray;
    options.push(this.initDetail());
  }

  removeDetail(index: number): void {
    const options: FormArray = this.form.get('details') as FormArray;
    options.removeAt(index);
  }

  get details(): FormGroup[] {
    const charges: FormArray = this.form.get('details') as FormArray;
    return charges.controls as FormGroup[];
  }

  save(): void {
    const denomination: TellerDenomination = {
      note: this.form.get('note').value,
      countedTotal: this.overallTotal.toString(10)
    };

    this.onSave.emit(denomination);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  getTotalValue(formGroup: FormGroup): number {
    const value = formGroup.get('value').value;
    const units = formGroup.get('count').value;
    if (value && units) {
      return parseFloat(value) * parseFloat(units);
    }
    return 0;
  }

  get overallTotal(): number {
    return this.details.reduce((previous, current) => {
      return previous + this.getTotalValue(current)
    }, 0)
  }
}
