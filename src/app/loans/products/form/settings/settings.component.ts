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
import {accountExists} from '../../../../../common/validator/account-exists.validator';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountingService} from '../../../../../services/accounting/accounting.service';
import {ledgerExists} from '../../../../../common/validator/ledger-exists.validator';

export interface SettingsFormData {
  loanFundAccount: string;
  customerLoanLedger: string;
  pendingDisbursal: string;
}

@Component({
  selector: 'fims-product-settings-form',
  templateUrl: './settings.component.html'
})
export class ProductSettingsFormComponent extends FormComponent<SettingsFormData> {

  @Input() set formData(settingsFormData: SettingsFormData) {
    this.form = this.formBuilder.group({
      loanFundAccount: [settingsFormData.loanFundAccount, [Validators.required], accountExists(this.accountingService)],
      customerLoanLedger: [settingsFormData.customerLoanLedger, [Validators.required], ledgerExists(this.accountingService)],
      pendingDisbursal: [settingsFormData.pendingDisbursal, [Validators.required], accountExists(this.accountingService)],
    });
  }

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    super();
  }

  get formData(): SettingsFormData {
    return this.form.getRawValue();
  }

}
