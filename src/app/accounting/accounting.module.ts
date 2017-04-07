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

import {CommonModule} from '../../components/common.module';
import {AccountingRoutes} from './accounting.routing';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {GeneralLedgerComponent} from './general-ledger.component';
import {TrailBalanceComponent} from './trailBalance/trial-balance.component';
import {AccountComponent} from './accounts/account.component';
import {SubLedgerDetailComponent} from './sub-ledger.detail.component';
import {AccountResolver} from './accounts/account.resolver';
import {AccountDetailComponent} from './accounts/account.detail.component';
import {AccountStatusComponent} from './status/status.component';
import {AccountActivityComponent} from './activity/activity.component';
import {CommandsResolver} from './activity/commands.resolver';
import {AccountFormComponent} from './accounts/form/form.component';
import {CreateAccountFormComponent} from './accounts/form/create/create.form.component';
import {AccountListComponent} from './accounts/account.list.component';
import {SubLedgerComponent} from './sub-ledger.component';
import {EditAccountFormComponent} from './accounts/form/edit/edit.form.component';
import {JournalEntryListComponent} from './journalEntries/journal-entry.list.component';
import {JournalEntryFormComponent} from './journalEntries/form/form.component';
import {AccountEntryListComponent} from './accounts/entries/account-entry.list.component';
import {LedgerFormComponent} from './form/form.component';
import {EditLedgerFormComponent} from './form/edit/edit.form.component';
import {CreateLedgerFormComponent} from './form/create/create.form.component';
import {LedgerExistsGuard} from './ledger-exists.guard';
import {AccountExistsGuard} from './accounts/account-exists.guard';
import {AccountingStore, accountingStoreFactory} from './store/index';
import {Store} from '@ngrx/store';

@NgModule({
  imports: [
    RouterModule.forChild(AccountingRoutes),
    CommonModule
  ],
  declarations: [
    GeneralLedgerComponent,
    SubLedgerComponent,
    SubLedgerDetailComponent,
    LedgerFormComponent,
    CreateLedgerFormComponent,
    EditLedgerFormComponent,
    TrailBalanceComponent,
    AccountComponent,
    AccountListComponent,
    AccountEntryListComponent,
    AccountDetailComponent,
    AccountStatusComponent,
    AccountActivityComponent,
    AccountFormComponent,
    CreateAccountFormComponent,
    EditAccountFormComponent,
    JournalEntryListComponent,
    JournalEntryFormComponent
  ],
  providers: [
    AccountResolver,
    CommandsResolver,
    LedgerExistsGuard,
    AccountExistsGuard,
    { provide: AccountingStore, useFactory: accountingStoreFactory, deps: [Store]}
  ]
})
export class AccountingModule{}
