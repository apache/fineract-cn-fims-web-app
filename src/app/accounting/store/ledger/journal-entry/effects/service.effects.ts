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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as journalEntryActions from '../journal-entry.actions';
import {AccountingService} from '../../../../../services/accounting/accounting.service';

@Injectable()
export class JournalEntryApiEffects {

  @Effect()
  loadJournalEntries$: Observable<Action> = this.actions$
    .ofType(journalEntryActions.SEARCH)
    .map((action: journalEntryActions.SearchAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.fetchJournalEntries(payload.startDate, payload.endDate, payload.account, payload.amount)
        .map(journalEntries => new journalEntryActions.SearchCompleteAction(journalEntries))
        .catch(() => of(new journalEntryActions.SearchCompleteAction([])))
    );

  @Effect()
  createJournalEntry$: Observable<Action> = this.actions$
    .ofType(journalEntryActions.CREATE)
    .map((action: journalEntryActions.CreateJournalEntryAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.createJournalEntry(payload.journalEntry)
        .map(() => new journalEntryActions.CreateJournalEntrySuccessAction(payload))
        .catch((error) => of(new journalEntryActions.CreateJournalEntryFailAction(error)))
    );

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

}
