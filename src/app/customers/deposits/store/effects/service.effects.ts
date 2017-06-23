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

import {of} from 'rxjs/observable/of';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import {emptySearchResult} from '../../../../../common/store/search.reducer';
import {DepositAccountService} from '../../../../../services/depositAccount/deposit-account.service';
import {Injectable} from '@angular/core';
import * as instanceActions from '../deposit.actions';

@Injectable()
export class DepositProductInstanceApiEffects {

  constructor(private actions$: Actions, private depositService: DepositAccountService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(instanceActions.SEARCH)
    .debounceTime(300)
    .map(action => action.payload)
    .switchMap(payload => {
      const nextSearch$ = this.actions$.ofType(instanceActions.SEARCH).skip(1);

      return this.depositService.fetchProductInstances(payload.customerId)
        .takeUntil(nextSearch$)
        .map(productInstances => new instanceActions.SearchCompleteAction({
          elements: productInstances,
          totalElements: productInstances.length,
          totalPages: 1
        }))
        .catch(() => of(new instanceActions.SearchCompleteAction(emptySearchResult())));
    });

  @Effect()
  createProduct$: Observable<Action> = this.actions$
    .ofType(instanceActions.CREATE)
    .map((action: instanceActions.CreateProductInstanceAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.createProductInstance(payload.productInstance)
        .map(() => new instanceActions.CreateProductInstanceSuccessAction({
          resource: payload.productInstance,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new instanceActions.CreateProductInstanceFailAction(error)))
    );

  @Effect()
  updateProduct$: Observable<Action> = this.actions$
    .ofType(instanceActions.UPDATE)
    .map((action: instanceActions.UpdateProductInstanceAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.updateProductInstance(payload.productInstance)
        .map(() => new instanceActions.UpdateProductInstanceSuccessAction({
          resource: payload.productInstance,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new instanceActions.UpdateProductInstanceFailAction(error)))
    );
}
