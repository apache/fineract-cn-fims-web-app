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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableData, TableFetchRequest} from '../../../common/data-table/data-table.component';
import {Account} from '../../../services/accounting/domain/account.model';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {todayAsISOString, toShortISOString} from '../../../services/domain/date.converter';
import {FimsValidators} from '../../../common/validator/validators';
import * as fromAccounting from '../../store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AccountingStore} from '../../store/index';
import {SEARCH} from '../../store/account/entries/entries.actions';
import {SelectAction} from '../../store/account/account.actions';
import {DatePipe} from '@angular/common';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';

@Component({
  templateUrl: './account-entry.list.component.html',
  providers: [DatePipe]
})
export class AccountEntryListComponent implements OnInit, OnDestroy {

  private actionsSubscription: Subscription;

  private lastFetchRequest: FetchRequest = {};

  form: FormGroup;

  account$: Observable<Account>;

  accountEntryData$: Observable<TableData>;

  columns: any[] = [
    {
      name: 'transactionDate', label: 'Transaction date', tooltip: 'Transaction date', format: (v: any) => {
        return this.datePipe.transform(v, 'short');
    }
    },
    {name: 'type', label: 'Type', tooltip: 'Type'},
    {name: 'message', label: 'Message', tooltip: 'Message'},
    {name: 'amount', label: 'Amount', tooltip: 'Amount'},
    {name: 'balance', label: 'Balance', tooltip: 'Balance'}
  ];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private store: AccountingStore, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    const today = todayAsISOString();
    this.form = this.formBuilder.group({
      'startDate': [today, [Validators.required]],
      'endDate': [today, [Validators.required]],
    }, {validator: FimsValidators.matchRange('startDate', 'endDate')});

    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.account$ = this.store.select(fromAccounting.getSelectedAccount)
      .filter(account => !!account)
      .do(account => this.fetchAccountsEntries(account.identifier));

    this.accountEntryData$ = this.store.select(fromAccounting.getAccountEntrySearchResults)
      .map(accountEntryPage => ({
        totalElements: accountEntryPage.totalElements,
        totalPages: accountEntryPage.totalPages,
        data: accountEntryPage.entries
      }));
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  fetchAccountsEntries(accountId: string, fetchRequest?: TableFetchRequest): void {
    if (fetchRequest) {
      this.lastFetchRequest = fetchRequest;
    }

    const startDate = toShortISOString(this.form.get('startDate').value);
    const endDate = toShortISOString(this.form.get('endDate').value);

    this.store.dispatch({
      type: SEARCH, payload: {
        accountId,
        startDate,
        endDate,
        fetchRequest: this.lastFetchRequest
      }
    });

  }
}
