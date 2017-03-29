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

import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Effect, Actions} from '@ngrx/effects';
import * as journalEntryActions from '../entries.actions'
import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {AccountingService} from '../../../../../../services/accounting/accounting.service';

@Injectable()
export class AccountEntryApiEffects{

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

  @Effect()
  loadJournalEntries$: Observable<Action> = this.actions$
    .ofType(journalEntryActions.SEARCH)
    .map((action: journalEntryActions.SearchAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.fetchAccountEntries(payload.accountId, payload.startDate, payload.endDate, payload.fetchRequest)
        .map(accountEntryPage => new journalEntryActions.SearchCompleteAction(accountEntryPage))
        .catch(() => of(new journalEntryActions.SearchCompleteAction({
          accountEntries: [],
          totalPages: 0,
          totalElements: 0
        })))
    );
}
