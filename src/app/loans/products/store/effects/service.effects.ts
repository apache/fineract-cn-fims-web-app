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
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {Actions, Effect} from '@ngrx/effects';
import * as productActions from '../product.actions';
import {mapToFimsProducts, mapToProduct} from '../model/fims-product.mapper';
import {emptySearchResult} from '../../../../common/store/search.reducer';
import {map, debounceTime, skip, takeUntil, mergeMap, switchMap, catchError} from 'rxjs/operators';

@Injectable()
export class ProductApiEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(productActions.SEARCH).pipe(
    map((action: productActions.SelectAction) => action.payload),
    debounceTime(300),
    switchMap(fetchRequest => {
      const nextSearch$ = this.actions$.ofType(productActions.SEARCH).pipe(skip(1));

      return this.portfolioService.findAllProducts(true, fetchRequest )
        .pipe(
          takeUntil(nextSearch$),
         map(productPage => new productActions.SearchCompleteAction({
          elements: mapToFimsProducts(productPage.elements),
          totalElements: productPage.totalElements,
          totalPages: productPage.totalPages
        })),
        catchError(() => of(new productActions.SearchCompleteAction(emptySearchResult()))));
    }));

  @Effect()
  createProduct$: Observable<Action> = this.actions$
    .ofType(productActions.CREATE).pipe(
    map((action: productActions.CreateProductAction) => action.payload),
    mergeMap(payload =>
      this.portfolioService.createProduct(mapToProduct(payload.product)).pipe(
        map(() => new productActions.CreateProductSuccessAction({
          resource: payload.product,
          activatedRoute: payload.activatedRoute
        })),
        catchError((error) => of(new productActions.CreateProductFailAction(error))))
    ));

  @Effect()
  updateProduct$: Observable<Action> = this.actions$
    .ofType(productActions.UPDATE).pipe(
    map((action: productActions.UpdateProductAction) => action.payload),
    mergeMap(payload =>
      this.portfolioService.changeProduct(mapToProduct(payload.product)).pipe(
        map(() => new productActions.UpdateProductSuccessAction({
          resource: payload.product,
          activatedRoute: payload.activatedRoute
        })),
        catchError((error) => of(new productActions.UpdateProductFailAction(error))))
    ));

  @Effect()
  deleteProduct$: Observable<Action> = this.actions$
    .ofType(productActions.DELETE).pipe(
    map((action: productActions.DeleteProductAction) => action.payload),
    mergeMap(payload =>
      this.portfolioService.deleteProduct(payload.product.identifier).pipe(
        map(() => new productActions.DeleteProductSuccessAction({
          resource: payload.product,
          activatedRoute: payload.activatedRoute
        })),
        catchError((error) => of(new productActions.DeleteProductFailAction(error))))
    ));

  @Effect()
  enableProduct$: Observable<Action> = this.actions$
    .ofType(productActions.ENABLE).pipe(
    map((action: productActions.EnableProductAction) => action.payload),
    mergeMap(payload =>
      this.portfolioService.enableProduct(payload.product.identifier, payload.enable).pipe(
        map(() => new productActions.EnableProductSuccessAction(payload)),
        catchError((error) =>
          this.portfolioService.incompleteaccountassignments(payload.product.identifier).pipe(
            map(accountAssignments => new productActions.EnableProductFailAction(accountAssignments))))
    )));

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }
}
