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
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as caseActions from '../case.actions';
import { PortfolioService } from '../../../../services/portfolio/portfolio.service';
import { Product } from '../../../../services/portfolio/domain/product.model';
import { map, mergeMap, catchError, debounceTime, takeUntil, skip, switchMap } from 'rxjs/operators';

@Injectable()
export class CaseApiEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(caseActions.SEARCH)
    .pipe(
      debounceTime(300),
      map((action: caseActions.SearchAction) => action.payload),
      switchMap(payload => {
        const nextSearch$ = this.actions$.ofType(caseActions.SEARCH).pipe(skip(1));

        return this.portfolioService.getAllCasesForCustomer(payload.customerId, payload.fetchRequest)
          .pipe(
            takeUntil(nextSearch$),
            map(fimsCasePage => new caseActions.SearchCompleteAction(fimsCasePage)),
            catchError(() => of(new caseActions.SearchCompleteAction({
              totalElements: 0,
              totalPages: 0,
              elements: []
            }))));
      }));

  @Effect()
  createCase$: Observable<Action> = this.actions$
    .ofType(caseActions.CREATE).pipe(
      map((action: caseActions.CreateCaseAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.createCase(payload.productId, payload.caseInstance).pipe(
          map(() => new caseActions.CreateCaseSuccessAction({
            resource: payload.caseInstance,
            activatedRoute: payload.activatedRoute
          })))
          .pipe(catchError((error) => of(new caseActions.CreateCaseFailAction(error)))
          )));


  @Effect()
  updateCase$: Observable<Action> = this.actions$
    .ofType(caseActions.UPDATE).pipe(
      map((action: caseActions.UpdateCaseAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.changeCase(payload.productId, payload.caseInstance).pipe(
          map(() => new caseActions.UpdateCaseSuccessAction({
            resource: payload.caseInstance,
            activatedRoute: payload.activatedRoute
          })))
          .pipe(catchError((error) => of(new caseActions.UpdateCaseFailAction(error)))
          )));

  @Effect()
  loadProduct$: Observable<Action> = this.actions$
    .ofType(caseActions.LOAD_PRODUCT).pipe(
      map((action: caseActions.LoadProductAction) => action.payload),
      mergeMap(productId =>
        this.portfolioService.getProduct(productId).pipe(
          map((product: Product) => new caseActions.LoadProductSuccessAction(product)))
          .pipe(catchError((error) => of(new caseActions.LoadProductFailAction(error)))
          )));

  @Effect()
  executeCommand$: Observable<Action> = this.actions$
    .ofType(caseActions.EXECUTE_COMMAND).pipe(
      map((action: caseActions.ExecuteCommandAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.executeCaseCommand(payload.productId, payload.caseId, payload.action, payload.command).pipe(
          map(() => new caseActions.ExecuteCommandSuccessAction(payload)))
          .pipe(catchError((error) => of(new caseActions.ExecuteCommandFailAction(error)))
          )));

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }

}
