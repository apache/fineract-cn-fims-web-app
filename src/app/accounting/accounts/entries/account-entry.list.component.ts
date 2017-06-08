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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableFetchRequest, TableData} from '../../../../common/data-table/data-table.component';
import {Account} from '../../../../services/accounting/domain/account.model';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {todayAsISOString, toLongISOString} from '../../../../services/domain/date.converter';
import {FimsValidators} from '../../../../common/validator/validators';
import * as fromAccounting from '../../store';
import {Observable, Subscription} from 'rxjs';
import {AccountingStore} from '../../store/index';
import {SEARCH} from '../../store/account/entries/entries.actions';
import {SelectAction} from '../../store/account/account.actions';

@Component({
  templateUrl: './account-entry.list.component.html'
})
export class AccountEntryListComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private accountSubscription: Subscription;

  form: FormGroup;

  account: Account;

  accountEntryData$: Observable<TableData>;

  columns: any[] = [
    { name: 'transactionDate', label: 'Transaction date', tooltip: 'Transaction date' },
    { name: 'type', label: 'Type', tooltip: 'Type' },
    { name: 'message', label: 'Message', tooltip: 'Message' },
    { name: 'amount', label: 'Amount', tooltip: 'Amount' },
    { name: 'balance', label: 'Balance', tooltip: 'Balance' }
  ];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private store: AccountingStore) {}

  ngOnInit(): void {
    let today = todayAsISOString();
    this.form = this.formBuilder.group({
      'startDate': [ today, [Validators.required] ],
      'endDate': [ today, [Validators.required] ],
    }, { validator: FimsValidators.matchRange('startDate', 'endDate') });

    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.accountSubscription = this.store.select(fromAccounting.getSelectedAccount)
      .subscribe(account => {
        this.account = account;
        this.fetchAccountsEntries();
      });

    this.accountEntryData$ = this.store.select(fromAccounting.getAccountEntrySearchResults)
      .map(accountEntryPage => ({
        totalElements: accountEntryPage.totalElements,
        totalPages: accountEntryPage.totalPages,
        data: accountEntryPage.entries
      }));
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  fetchAccountsEntries(fetchRequest?: TableFetchRequest): void{
    let startDate = toLongISOString(this.form.get('startDate').value);
    let endDate = toLongISOString(this.form.get('endDate').value);

    this.store.dispatch({ type: SEARCH, payload: {
      accountId: this.account.identifier,
      startDate: startDate,
      endDate: endDate,
      fetchRequest: fetchRequest
    } });

  }
}
