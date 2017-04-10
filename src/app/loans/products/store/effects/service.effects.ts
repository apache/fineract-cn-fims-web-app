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
import {PortfolioService} from '../../../../../services/portfolio/portfolio.service';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import * as productActions from '../product.actions';
import {of} from 'rxjs/observable/of';
import {mapToFimsProduct, mapToFimsProducts, mapToProduct} from '../model/fims-product.mapper';

@Injectable()
export class ProductApiEffects {

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(productActions.SEARCH)
    .debounceTime(300)
    .switchMap(() => {
      const nextSearch$ = this.actions$.ofType(productActions.SEARCH).skip(1);

      return this.portfolioService.findAllProducts()
        .takeUntil(nextSearch$)
        .map(products => new productActions.SearchCompleteAction(mapToFimsProducts(products)))
        .catch(() => of(new productActions.SearchCompleteAction([])));
    });

  @Effect()
  createProduct$: Observable<Action> = this.actions$
    .ofType(productActions.CREATE)
    .map((action: productActions.CreateProductAction) => action.payload)
    .mergeMap(payload =>
      this.portfolioService.createProduct(mapToProduct(payload.product))
        .map(() => new productActions.CreateProductSuccessAction(payload))
        .catch((error) => of(new productActions.CreateProductFailAction(error)))
    );

  @Effect()
  updateProduct$: Observable<Action> = this.actions$
    .ofType(productActions.UPDATE)
    .map((action: productActions.UpdateProductAction) => action.payload)
    .mergeMap(payload =>
      this.portfolioService.changeProduct(mapToProduct(payload.product))
        .map(() => new productActions.UpdateProductSuccessAction(payload))
        .catch((error) => of(new productActions.UpdateProductFailAction(error)))
    );

  @Effect()
  enableProduct$: Observable<Action> = this.actions$
    .ofType(productActions.ENABLE)
    .map((action: productActions.EnableProductAction) => action.payload)
    .mergeMap(payload =>
      this.portfolioService.enableProduct(payload.product.identifier, payload.enable)
        .map(() => new productActions.EnableProductSuccessAction(payload))
        .catch((error) => of(new productActions.EnableProductFailAction(error)))
    );
}
