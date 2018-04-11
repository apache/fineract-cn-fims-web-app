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
import {JournalEntry} from '../../../services/accounting/domain/journal-entry.model';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TdStepComponent} from '@covalent/core';
import * as fromAccounting from '../../store';
import * as fromRoot from '../../../store';
import {CREATE, RESET_FORM} from '../../store/ledger/journal-entry/journal-entry.actions';
import {Error} from '../../../services/domain/error.model';
import {AccountingStore} from '../../store/index';
import {Observable} from 'rxjs/Observable';
import {todayAsISOString} from '../../../services/domain/date.converter';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateJournalEntryFormComponent implements OnInit, OnDestroy {

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  journalEntry$: Observable<JournalEntry>;

  error$: Observable<Error>;

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {
  }

  ngOnInit(): void {
    this.error$ = this.store.select(fromAccounting.getJournalEntryFormError)
      .filter((error: Error) => !!error);

    this.journalEntry$ = this.store.select(fromRoot.getUsername)
      .map(username => ({
        transactionIdentifier: '',
        transactionDate: todayAsISOString(),
        transactionType: '',
        clerk: username,
        debtors: [
          { accountNumber: '', amount: '0' }
        ],
        creditors: [
          { accountNumber: '', amount: '0' }
        ]
      }));
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: RESET_FORM });
  }

  save(journalEntry: JournalEntry): void {
    this.store.dispatch({ type: CREATE, payload: {
      journalEntry,
      activatedRoute: this.route
    } });
  }

  cancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
