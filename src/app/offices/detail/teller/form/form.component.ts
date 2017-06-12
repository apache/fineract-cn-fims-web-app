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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Teller} from '../../../../../services/teller/domain/teller.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';
import {AccountingService} from '../../../../../services/accounting/accounting.service';
import {accountExists} from '../../../../../common/validator/account-exists.validator';
import {FormComponent} from '../../../../../common/forms/form.component';
import {TdStepComponent} from '@covalent/core';

@Component({
  selector: 'fims-teller-form-component',
  templateUrl: './form.component.html'
})
export class OfficeTellerFormComponent extends FormComponent<Teller> {

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input() set teller(teller: Teller) {
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
      code: [teller.code, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe()]],
      password: [teller.password, Validators.required],
      cashdrawLimit: [teller.cashdrawLimit],
      tellerAccountIdentifier: [teller.tellerAccountIdentifier, [Validators.required], accountExists(this.accountService)],
      vaultAccountIdentifier: [teller.vaultAccountIdentifier, [Validators.required], accountExists(this.accountService)]
    });

    this.step.open();
  }

  save(): void {
    const teller: Teller = {
      code: this.form.get('code').value,
      password: this.form.get('password').value,
      cashdrawLimit: this.form.get('cashdrawLimit').value,
      tellerAccountIdentifier: this.form.get('tellerAccountIdentifier').value,
      vaultAccountIdentifier: this.form.get('vaultAccountIdentifier').value
    };

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
}
