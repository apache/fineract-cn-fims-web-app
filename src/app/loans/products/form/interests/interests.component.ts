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

import {Component, Input} from '@angular/core';
import {FormComponent} from '../../../../../common/forms/form.component';
import {InterestBasis} from '../../../../../services/portfolio/domain/interest-basis.model';
import {FormBuilder, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';
import {AccountingService} from '../../../../../services/accounting/accounting.service';
import {accountExists} from '../../../../../common/validator/account-exists.validator';

interface InterestBasisOption{
  type: InterestBasis;
  label: string;
}

export interface InterestFormData{
  minimum: number;
  maximum: number;
  interestBasis: InterestBasis;
  incomeAccount: string;
  accrualAccount: string;
}

@Component({
  selector: 'fims-product-interests-form',
  templateUrl: './interests.component.html'
})
export class ProductInterestFormComponent extends FormComponent<InterestFormData> {

  interestBasisOptions: InterestBasisOption[] = [
    {type: 'CURRENT_BALANCE', label: 'CURRENT_BALANCE'},
    {type: 'BEGINNING_BALANCE', label: 'BEGINNING_BALANCE'}
  ];

  @Input() set formData(interestFormData: InterestFormData) {
    this.form = this.formBuilder.group({
      minimum: [interestFormData.minimum, [Validators.required, FimsValidators.isNumber(), FimsValidators.minValue(0), FimsValidators.precision(2)]],
      maximum: [interestFormData.maximum, [Validators.required, FimsValidators.isNumber(), FimsValidators.minValue(0), FimsValidators.precision(2)]],
      interestBasis: [interestFormData.interestBasis, Validators.required],
      incomeAccount: [interestFormData.incomeAccount, [Validators.required], accountExists(this.accountingService)],
      accrualAccount: [interestFormData.accrualAccount, [Validators.required], accountExists(this.accountingService)]
    }, {validator: FimsValidators.greaterThan('minimum', 'maximum')});

  };

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    super();
  }

  get formData(): InterestFormData {
    return this.form.getRawValue();
  }


}
