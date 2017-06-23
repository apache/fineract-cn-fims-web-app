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

import {Component, OnInit, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import {AccountType} from '../../../../services/accounting/domain/account-type.model';
import {Account} from '../../../../services/accounting/domain/account.model';
import {FormBuilder, Validators} from '@angular/forms';
import {FormComponent} from '../../../../common/forms/form.component';
import {TdStepComponent} from '@covalent/core';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {Observable} from 'rxjs';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import {AccountPage} from '../../../../services/accounting/domain/account-page.model';
import {AccountTypeOption} from '../../account-types.model';
import {accountTypes} from '../../account-types.model'
import {FimsValidators} from '../../../../common/validator/validators';

@Component({
  selector: 'fims-account-form-component',
  templateUrl: './form.component.html'
})
export class AccountFormComponent extends FormComponent<Account> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  accounts: Observable<Account[]>;

  @Input() account: Account;

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<Account>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  accountTypeOptions: AccountTypeOption[] = accountTypes;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.openDetailStep();
    this.form = this.formBuilder.group({
      'identifier': [ this.account.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(34), FimsValidators.urlSafe()] ],
      'name': [ this.account.name, [Validators.required] ],
      'type': [ this.account.type, [Validators.required] ],
      'ledger': [ this.account.ledger, [Validators.required] ],
      'balance': [ { value: this.account.balance, disabled: this.editMode }, [Validators.required] ],
    });
  }

  openDetailStep(): void{
    this.step.open();
  }

  showIdentifierValidationError(): void{
    this.setError('identifier', 'unique', true);
    this.openDetailStep();
  }

  get formData(): Account {
    // Not needed
    return;
  }

  save(): void{
    let account: Account = {
      identifier: this.form.get('identifier').value,
      name: this.form.get('name').value,
      type: this.form.get('type').value,
      ledger: this.form.get('ledger').value,
      balance: this.form.get('balance').value
    };

    this.onSave.emit(account);
  }

  cancel(): void{
    this.onCancel.emit();
  }

}
