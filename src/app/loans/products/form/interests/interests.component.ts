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

import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormComponent} from '../../../../common/forms/form.component';
import {FormBuilder, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {accountExists} from '../../../../common/validator/account-exists.validator';

export interface InterestFormData {
  minimum: string;
  maximum: string;
  incomeAccount: string;
  accrualAccount: string;
}

@Component({
  selector: 'fims-product-interests-form',
  templateUrl: './interests.component.html'
})
export class ProductInterestFormComponent extends FormComponent<InterestFormData> implements OnChanges {

  private _formData: InterestFormData;

  private minMaxValidators: ValidatorFn[] = [Validators.required, FimsValidators.minValue(0), FimsValidators.scale(2)];

  @Input() set formData(formData: InterestFormData) {
    this._formData = formData;
  };

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    super();

    this.form = this.formBuilder.group({
      interestRangeEnabled: [false],
      minimum: ['', this.minMaxValidators],
      maximum: [''],
      incomeAccount: ['', [Validators.required], accountExists(this.accountingService)],
      accrualAccount: ['', [Validators.required], accountExists(this.accountingService)]
    });

    this.form.get('interestRangeEnabled').valueChanges
      .subscribe(enabled => this.toggleInterestRange(enabled));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const interestRangeEnabled: boolean = this.hasInterestRange(this._formData.minimum, this._formData.maximum);

    this.form.reset({
      interestRangeEnabled: interestRangeEnabled,
      minimum: this._formData.minimum,
      maximum: this._formData.maximum,
      incomeAccount: this._formData.incomeAccount,
      accrualAccount: this._formData.accrualAccount
    });
  }

  get formData(): InterestFormData {
    return {
      minimum: this.form.get('minimum').value,
      maximum: this.form.get('interestRangeEnabled').value ? this.form.get('maximum').value : this.form.get('minimum').value,
      incomeAccount: this.form.get('incomeAccount').value,
      accrualAccount: this.form.get('accrualAccount').value
    };
  }

  private toggleInterestRange(enabled: boolean): void {
    const maximumControl: FormControl = this.form.get('maximum') as FormControl;

    if (enabled) {
      maximumControl.setValidators(this.minMaxValidators);
      this.form.setValidators(FimsValidators.greaterThan('minimum', 'maximum'));
    } else {
      maximumControl.clearValidators();
      this.form.clearValidators();
    }

    maximumControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private hasInterestRange(min: string, max: string): boolean {
    return this.hasValue(min) &&
        this.hasValue(max) &&
        min !== max;
  }

  private hasValue(value: string): boolean {
    return value !== undefined;
  }


}
