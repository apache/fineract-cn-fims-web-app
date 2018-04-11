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
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {todayAsISOString, toShortISOString} from '../../services/domain/date.converter';
import {FimsValidators} from '../../common/validator/validators';
import * as fromAccounting from '../store';
import {SEARCH} from '../store/ledger/journal-entry/journal-entry.actions';
import {Observable} from 'rxjs/Observable';
import {AccountingStore} from '../store/index';
import {DatePipe} from '@angular/common';
import {JournalEntry} from '../../services/accounting/domain/journal-entry.model';
import {Debtor} from '../../services/accounting/domain/debtor.model';

@Component({
  templateUrl: './journal-entry.list.component.html',
  providers: [DatePipe]
})
export class JournalEntryListComponent implements OnInit {

  numberFormat = '1.2-2';

  form: FormGroup;

  journalEntries$: Observable<JournalEntry[]>;

  journalEntry: JournalEntry;

  constructor(private formBuilder: FormBuilder, private store: AccountingStore) {
  }

  ngOnInit(): void {
    this.journalEntries$ = this.store.select(fromAccounting.getJournalEntriesSearchResult)
      .do(journalEntries => this.select(journalEntries.length > 0 ? journalEntries[0] : undefined));

    const today = todayAsISOString();

    this.form = this.formBuilder.group({
      'startDate': [today, [Validators.required]],
      'endDate': [today, [Validators.required]],
      'account': [],
      'amount': [],
    }, {validator: FimsValidators.matchRange('startDate', 'endDate')});

    this.fetchJournalEntries();
  }

  fetchJournalEntries(): void {
    const startDate = toShortISOString(this.form.get('startDate').value);
    const endDate = toShortISOString(this.form.get('endDate').value);
    const account = this.form.get('account').value;
    const amount = this.form.get('amount').value;

    this.store.dispatch({
      type: SEARCH, payload: {
        startDate,
        endDate,
        account,
        amount: amount ? amount.toFixed(2) : undefined
      }
    });
  }

  select(journalEntry: JournalEntry): void {
    this.journalEntry = journalEntry;
  }

  sumDebtors(debtors: Debtor[]): number {
    return debtors.reduce((sum, debtor) => {
      return sum + parseFloat(debtor.amount);
    }, 0);
  }

}
