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

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Teller} from '../../../../services/teller/domain/teller.model';
import {FormBuilder, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {accountExists} from '../../../../common/validator/account-exists.validator';
import {FormComponent} from '../../../../common/forms/form.component';
import {TdStepComponent} from '@covalent/core';

@Component({
  selector: 'fims-teller-form-component',
  templateUrl: './form.component.html'
})
export class OfficeTellerFormComponent extends FormComponent<Teller> {

  private _teller: Teller;

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input() set teller(teller: Teller) {
    this._teller = teller;
    this.prepareForm(teller);
  }

  @Input('editMode') editMode: boolean;

  @Output() onSave = new EventEmitter<Teller>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private accountService: AccountingService) {
    super();
  }

  prepareForm(teller: Teller): void {
    this.form = this.formBuilder.group({
      code: [teller.code, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      password: [teller.password, [Validators.required, Validators.minLength(8), Validators.maxLength(4096)]],
      cashdrawLimit: [teller.cashdrawLimit, [Validators.required, FimsValidators.greaterThanValue(0)]],
      tellerAccountIdentifier: [teller.tellerAccountIdentifier, [Validators.required], accountExists(this.accountService)],
      vaultAccountIdentifier: [teller.vaultAccountIdentifier, [Validators.required], accountExists(this.accountService)],
      chequesReceivableAccount: [teller.chequesReceivableAccount, [Validators.required], accountExists(this.accountService)],
      cashOverShortAccount: [teller.cashOverShortAccount, [Validators.required], accountExists(this.accountService)],
      denominationRequired: [teller.denominationRequired]
    });

    this.step.open();
  }

  save(): void {
    const teller: Teller = Object.assign({}, this.teller, {
      code: this.form.get('code').value,
      password: this.form.get('password').value,
      cashdrawLimit: this.form.get('cashdrawLimit').value,
      tellerAccountIdentifier: this.form.get('tellerAccountIdentifier').value,
      vaultAccountIdentifier: this.form.get('vaultAccountIdentifier').value,
      chequesReceivableAccount: this.form.get('chequesReceivableAccount').value,
      cashOverShortAccount: this.form.get('cashOverShortAccount').value,
      denominationRequired: this.form.get('denominationRequired').value
    });

    this.onSave.emit(teller);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get formData(): Teller {
    // Not needed
    return null;
  }

  showCodeValidationError(): void {
    this.setError('code', 'unique', true);
  }

  get teller(): Teller {
    return this._teller;
  }
}
