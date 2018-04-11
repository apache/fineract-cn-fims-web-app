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
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import * as accountEntryActions from '../entries.actions';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {AccountingService} from '../../../../../services/accounting/accounting.service';

@Injectable()
export class AccountEntryApiEffects {

  @Effect()
  loadAccountEntries$: Observable<Action> = this.actions$
    .ofType(accountEntryActions.SEARCH)
    .map((action: accountEntryActions.SearchAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.fetchAccountEntries(payload.accountId, payload.startDate, payload.endDate, payload.fetchRequest)
        .map(accountEntryPage => new accountEntryActions.SearchCompleteAction(accountEntryPage))
        .catch(() => of(new accountEntryActions.SearchCompleteAction({
          accountEntries: [],
          totalPages: 0,
          totalElements: 0
        })))
    );

  constructor(private actions$: Actions, private accountingService: AccountingService) { }
}
