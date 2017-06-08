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

import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as transactionTypeActions from '../transaction-type.actions';
import {AccountingService} from '../../../../../../services/accounting/accounting.service';
import {emptySearchResult} from '../../../../../../common/store/search.reducer';

@Injectable()
export class TransactionTypeApiEffects {

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

  @Effect()
  searchTransactionTypes$: Observable<Action> = this.actions$
    .ofType(transactionTypeActions.SEARCH)
    .map((action: transactionTypeActions.SearchAction) => action.payload)
    .mergeMap(fetchRequest =>
      this.accountingService.fetchTransactionTypes(fetchRequest)
        .map(transactionTypePage => new transactionTypeActions.SearchCompleteAction({
          elements: transactionTypePage.transactionTypes,
          totalElements: transactionTypePage.totalElements,
          totalPages: transactionTypePage.totalPages
        }))
        .catch(() => of(new transactionTypeActions.SearchCompleteAction(emptySearchResult())))
    );

  @Effect()
  createTransactionType$: Observable<Action> = this.actions$
    .ofType(transactionTypeActions.CREATE)
    .map((action: transactionTypeActions.CreateTransactionTypeAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.createTransactionType(payload.transactionType)
        .map(() => new transactionTypeActions.CreateTransactionTypeSuccessAction({
          resource: payload.transactionType,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new transactionTypeActions.CreateTransactionTypeFailAction(error)))
    );

  @Effect()
  updateTransactionType$: Observable<Action> = this.actions$
    .ofType(transactionTypeActions.UPDATE)
    .map((action: transactionTypeActions.UpdateTransactionTypeAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.changeTransactionType(payload.transactionType)
        .map(() => new transactionTypeActions.UpdateTransactionTypeSuccessAction({
          resource: payload.transactionType,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new transactionTypeActions.UpdateTransactionTypeFailAction(error)))
    );
}
