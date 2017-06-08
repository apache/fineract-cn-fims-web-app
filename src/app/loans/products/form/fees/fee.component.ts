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
import {FormBuilder, Validators} from '@angular/forms';
import {AccountingService} from '../../../../../services/accounting/accounting.service';
import {accountExists} from '../../../../../common/validator/account-exists.validator';

export interface FeeFormData {
  processingFeeAccount: string;
  originationFeeAccount: string;
  disbursementFeeAccount: string;
  lateFeeIncomeAccount: string;
  lateFeeAccrualAccount: string;
}

@Component({
  selector: 'fims-product-fee-form',
  templateUrl: './fee.component.html'
})
export class ProductFeeFormComponent extends FormComponent<FeeFormData> {

  @Input() set formData(feeFormData: FeeFormData) {
    this.form = this.formBuilder.group({
      processingFeeAccount: [feeFormData.processingFeeAccount, [Validators.required], accountExists(this.accountingService)],
      originationFeeAccount: [feeFormData.originationFeeAccount, [Validators.required], accountExists(this.accountingService)],
      disbursementFeeAccount: [feeFormData.disbursementFeeAccount, [Validators.required], accountExists(this.accountingService)],
      lateFeeIncomeAccount: [feeFormData.lateFeeIncomeAccount, [Validators.required], accountExists(this.accountingService)],
      lateFeeAccrualAccount: [feeFormData.lateFeeAccrualAccount, [Validators.required], accountExists(this.accountingService)]
    });
  }

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    super();
  }

  get formData(): FeeFormData {
    return this.form.getRawValue();
  }

}
