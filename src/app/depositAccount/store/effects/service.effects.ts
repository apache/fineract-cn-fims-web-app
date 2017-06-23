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

import * as definitionActions from '../product.actions';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {DepositAccountService} from '../../../../services/depositAccount/deposit-account.service';
import {of} from 'rxjs/observable/of';
import {emptySearchResult} from '../../../../common/store/search.reducer';

@Injectable()
export class DepositProductDefinitionApiEffects {

  constructor(private actions$: Actions, private depositService: DepositAccountService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(definitionActions.SEARCH)
    .debounceTime(300)
    .switchMap(() => {
      const nextSearch$ = this.actions$.ofType(definitionActions.SEARCH).skip(1);

      return this.depositService.fetchProductDefinitions()
        .takeUntil(nextSearch$)
        .map(products => new definitionActions.SearchCompleteAction({
          elements: products,
          totalElements: products.length,
          totalPages: 1
        }))
        .catch(() => of(new definitionActions.SearchCompleteAction(emptySearchResult())));
    });

  @Effect()
  createProduct$: Observable<Action> = this.actions$
    .ofType(definitionActions.CREATE)
    .map((action: definitionActions.CreateProductDefinitionAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.createProductDefinition(payload.productDefinition)
        .map(() => new definitionActions.CreateProductDefinitionSuccessAction({
          resource: payload.productDefinition,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new definitionActions.CreateProductDefinitionFailAction(error)))
    );

  @Effect()
  updateProduct$: Observable<Action> = this.actions$
    .ofType(definitionActions.UPDATE)
    .map((action: definitionActions.UpdateProductDefinitionAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.updateProductDefinition(payload.productDefinition)
        .map(() => new definitionActions.UpdateProductDefinitionSuccessAction({
          resource: payload.productDefinition,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new definitionActions.UpdateProductDefinitionFailAction(error)))
    );

  @Effect()
  deleteProduct$: Observable<Action> = this.actions$
    .ofType(definitionActions.DELETE)
    .map((action: definitionActions.DeleteProductDefinitionAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.deleteProductDefinition(payload.productDefinition.identifier)
        .map(() => new definitionActions.DeleteProductDefinitionSuccessAction({
          resource: payload.productDefinition,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new definitionActions.DeleteProductDefinitionFailAction(error)))
    );

  @Effect()
  executeCommand$: Observable<Action> = this.actions$
    .ofType(definitionActions.EXECUTE_COMMAND)
    .map((action: definitionActions.ExecuteCommandAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.processCommand(payload.definitionId, payload.command)
        .map(() => new definitionActions.ExecuteCommandSuccessAction(payload))
        .catch((error) => of(new definitionActions.ExecuteCommandFailAction(error)))
    );
}
