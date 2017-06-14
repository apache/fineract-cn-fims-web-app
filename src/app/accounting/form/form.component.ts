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

import {accountTypes, AccountTypeOption} from '../account-types.model';
import {OnInit, Component, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import {FormComponent} from '../../../common/forms/form.component';
import {Ledger} from '../../../services/accounting/domain/ledger.model';
import {TdStepComponent} from '@covalent/core';
import {FormBuilder, Validators} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';

@Component({
  selector: 'fims-ledger-form-component',
  templateUrl: './form.component.html'
})
export class LedgerFormComponent extends FormComponent<Ledger> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input() parentLedger: Ledger;

  @Input() ledger: Ledger;

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<Ledger>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  accountTypeOptions: AccountTypeOption[] = accountTypes;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): Ledger {
    return null;
  }

  ngOnInit(): void {
    this.openDetailStep();
    this.form = this.formBuilder.group({
      'identifier': [ this.ledger.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe() ] ],
      'type': [ this.parentLedger ? this.parentLedger.type : this.ledger.type, [Validators.required] ],
      'name': [ this.ledger.name, [Validators.required] ],
      'showAccountsInChart': [ this.ledger.showAccountsInChart, [Validators.required]],
      'description': [ this.ledger.description ],
    });
  }

  showIdentifierValidationError(): void {
    this.setError('identifier', 'unique', true);
    this.openDetailStep();
  }

  openDetailStep(): void {
    this.step.open();
  }

  save(): void {
    let ledger: Ledger = {
      identifier: this.form.get('identifier').value,
      type: this.form.get('type').value,
      name: this.form.get('name').value,
      showAccountsInChart: this.form.get('showAccountsInChart').value,
      description: this.form.get('description').value,
      subLedgers: []
    };

    this.onSave.emit(ledger);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
