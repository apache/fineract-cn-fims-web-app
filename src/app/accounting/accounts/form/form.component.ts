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
import {FormComponent} from '../../../../components/forms/form.component';
import {TdStepComponent} from '@covalent/core';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {Observable} from 'rxjs';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import {AccountPage} from '../../../../services/accounting/domain/account-page.model';
import {AccountTypeOption} from '../../account-types.model';
import {accountTypes} from '../../account-types.model'

@Component({
  selector: 'fims-account-form-component',
  templateUrl: './form.component.html'
})
export class AccountFormComponent extends FormComponent<Account> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  holders: string[];

  signatureAuthorities: string[];

  referenceAccount: string;

  accounts: Observable<Account[]>;

  @Input() account: Account;

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<Account>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  accountTypeOptions: AccountTypeOption[] = accountTypes;

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    super();
  }

  ngOnInit() {
    this.openDetailStep();
    this.form = this.formBuilder.group({
      'identifier': [ this.account.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32)] ],
      'type': [ this.account.type, [Validators.required] ],
      'ledger': [ this.account.ledger, [Validators.required] ],
      'balance': [ { value: this.account.balance, disabled: this.editMode }, [Validators.required] ],
    });

    this.holders = this.account.holders;
    this.signatureAuthorities = this.account.signatureAuthorities;
    this.referenceAccount = this.account.referenceAccount;
    this.onAccountSearch();
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

  onHoldersSelectionChange(selection: string[]): void{
    this.holders = selection;
  }

  onAuthoritySelectionChange(selection: string[]): void{
    this.signatureAuthorities = selection;
  }

  onAccountSearch(searchTerm?: string): void{
    let fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 5
      },
      searchTerm: searchTerm
    };
    this.accounts = this.accountingService.fetchAccounts(fetchRequest).map((accountPage: AccountPage) => accountPage.accounts);
  }

  accountSelectionChange(selection: string[]): void{
    this.referenceAccount = selection && selection.length > 0 ? selection[0] : undefined;
  }

  save(): void{
    let account: Account = {
      identifier: this.form.get('identifier').value,
      type: this.form.get('type').value,
      ledger: this.form.get('ledger').value,
      balance: this.form.get('balance').value,
      holders: this.holders,
      signatureAuthorities: this.signatureAuthorities,
      referenceAccount: this.referenceAccount
    };

    this.onSave.emit(account);
  }

  cancel(): void{
    this.onCancel.emit();
  }

}
