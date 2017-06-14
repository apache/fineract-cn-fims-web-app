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
import {OnInit, Component} from '@angular/core';
import {TableData} from '../../../common/data-table/data-table.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Account} from '../../../services/accounting/domain/account.model';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {todayAsISOString} from '../../../services/domain/date.converter';
import {FimsValidators} from '../../../common/validator/validators';
import * as fromAccounting from '../store';
import {SEARCH} from '../store/ledger/journal-entry/journal-entry.actions';
import {Observable} from 'rxjs';
import {AccountingStore} from '../store/index';
import {ITdDataTableColumn} from '@covalent/core';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: './journal-entry.list.component.html',
  providers: [DatePipe]
})
export class JournalEntryListComponent implements OnInit{

  form: FormGroup;

  journalEntryData$: Observable<TableData>;

  columns: ITdDataTableColumn[];

  constructor(private formBuilder: FormBuilder, private store: AccountingStore, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'transactionIdentifier', label: 'Id', tooltip: 'Id' },
      { name: 'clerk', label: 'Clerk', tooltip: 'Clerk' },
      { name: 'state', label: 'State', tooltip: 'State' },
      { name: 'transactionType', label: 'Transaction type', tooltip: 'Transaction type' },
      { name: 'transactionDate', label: 'Transaction date', tooltip: 'Transaction date', format:  (v: any) => {
        return this.datePipe.transform(v, 'shortDate')
      }}
    ];

    this.journalEntryData$ = this.store.select(fromAccounting.getJournalEntriesSearchResult)
      .map(journalEntries => ({
        totalElements: journalEntries.length,
        totalPages: 1,
        data: journalEntries
      }));

    let today = todayAsISOString();

    this.form = this.formBuilder.group({
      'startDate': [ today, [Validators.required] ],
      'endDate': [ today, [Validators.required] ],
    }, { validator: FimsValidators.matchRange('startDate', 'endDate') });
    this.fetchJournalEntries()
  }

  fetchJournalEntries(): void{
    let startDate = this.form.get('startDate').value;
    let endDate = this.form.get('endDate').value;

    this.store.dispatch({ type: SEARCH, payload: {
      startDate,
      endDate
    }});

  }

}
