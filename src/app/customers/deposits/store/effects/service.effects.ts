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
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { emptySearchResult } from '../../../../common/store/search.reducer';
import { DepositAccountService } from '../../../../services/depositAccount/deposit-account.service';
import { Injectable } from '@angular/core';
import * as instanceActions from '../deposit.actions';
import { ChequeService } from '../../../../services/cheque/cheque.service';
import { map, debounceTime, takeUntil, mergeMap, skip, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class DepositProductInstanceApiEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(instanceActions.SEARCH)
    .pipe(
      debounceTime(300),
      map(action => action.payload),
      switchMap(payload => {
        const nextSearch$ = this.actions$.ofType(instanceActions.SEARCH).pipe(skip(1));

        return this.depositService.fetchProductInstances(payload.customerId)
          .pipe(
            takeUntil(nextSearch$),
            map(productInstances => new instanceActions.SearchCompleteAction({
              elements: productInstances,
              totalElements: productInstances.length,
              totalPages: 1
            })),
            catchError(() => of(new instanceActions.SearchCompleteAction(emptySearchResult()))));
      }));

  @Effect()
  createProduct$: Observable<Action> = this.actions$
    .ofType(instanceActions.CREATE).pipe(
      map((action: instanceActions.CreateProductInstanceAction) => action.payload),
      mergeMap(payload =>
        this.depositService.createProductInstance(payload.productInstance).pipe(
          map(() => new instanceActions.CreateProductInstanceSuccessAction({
            resource: payload.productInstance,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new instanceActions.CreateProductInstanceFailAction(error)))
        )));

  @Effect()
  updateProduct$: Observable<Action> = this.actions$
    .ofType(instanceActions.UPDATE).pipe(
      map((action: instanceActions.UpdateProductInstanceAction) => action.payload),
      mergeMap(payload =>
        this.depositService.updateProductInstance(payload.productInstance).pipe(
          map(() => new instanceActions.UpdateProductInstanceSuccessAction({
            resource: payload.productInstance,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new instanceActions.UpdateProductInstanceFailAction(error))))
      ));

  @Effect()
  issueCheques$: Observable<Action> = this.actions$
    .ofType(instanceActions.ISSUE_CHEQUES).pipe(
      map((action: instanceActions.IssueChequesAction) => action.payload),
      mergeMap(payload =>
        this.chequeService.issue(payload.issuingCount).pipe(
          map(() => new instanceActions.IssueChequesSuccessAction(payload)),
          catchError((error) => of(new instanceActions.IssueChequesFailAction(error))))
      ));

  constructor(private actions$: Actions, private depositService: DepositAccountService, private chequeService: ChequeService) { }
}
