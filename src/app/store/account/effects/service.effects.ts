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
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import * as accountActions from '../account.actions';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {emptySearchResult, SearchResult} from '../../../common/store/search.reducer';
import {AccountPage} from '../../../services/accounting/domain/account-page.model';
import {skip, takeUntil, catchError, switchMap, map, debounceTime} from 'rxjs/operators';

@Injectable()
export class AccountSearchApiEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .pipe(ofType(accountActions.SEARCH),
    debounceTime(300),
    map((action: accountActions.SearchAction) => action.payload),
    switchMap(fetchRequest => {
      const nextSearch$ = this.actions$.pipe(ofType(accountActions.SEARCH),(skip(1)));

      return this.accountingService.fetchAccounts(fetchRequest).pipe(
        takeUntil(nextSearch$),
        map(this.mapToSearchResult),
        map(searchResult => new accountActions.SearchCompleteAction(searchResult)),
        catchError(() => of(new accountActions.SearchCompleteAction(emptySearchResult()))),);
    }),);

  @Effect()
  searchByLedger$: Observable<Action> = this.actions$
    .pipe(ofType(accountActions.SEARCH_BY_LEDGER),
    debounceTime(300),
    map((action: accountActions.SearchByLedgerAction) => action.payload),
    switchMap(payload => {
      const nextSearch$ = this.actions$.pipe(ofType(accountActions.SEARCH_BY_LEDGER),(skip(1)));

      return this.accountingService.fetchAccountsOfLedger(payload.ledgerId, payload.fetchRequest).pipe(
        takeUntil(nextSearch$),
        map(this.mapToSearchResult),
        map(searchResult => new accountActions.SearchCompleteAction(searchResult)),
        catchError(() => of(new accountActions.SearchCompleteAction(emptySearchResult()))),);
    }),);

  private mapToSearchResult(accountPage: AccountPage): SearchResult {
    return {
      elements: accountPage.accounts,
      totalElements: accountPage.totalElements,
      totalPages: accountPage.totalPages
    };
  }

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

}
