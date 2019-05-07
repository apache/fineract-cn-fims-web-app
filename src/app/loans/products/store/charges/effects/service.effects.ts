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
import * as chargeActions from '../charge.actions';
import { PortfolioService } from '../../../../../services/portfolio/portfolio.service';
import { map, debounceTime, switchMap, mergeMap, catchError, skip, takeUntil } from 'rxjs/operators';

@Injectable()
export class ProductChargesApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(chargeActions.LOAD_ALL)
    .pipe(
      debounceTime(300),
      map((action: chargeActions.LoadAllAction) => action.payload),
      switchMap(id => {
        const nextSearch$ = this.actions$.ofType(chargeActions.LOAD_ALL).pipe(skip(1));

        return this.portfolioService.findAllChargeDefinitionsForProduct(id)
          .pipe(
            takeUntil(nextSearch$),
            map(chargeDefinitions => new chargeActions.LoadAllCompleteAction(chargeDefinitions)),
            catchError(() => of(new chargeActions.LoadAllCompleteAction([]))));
      }));

  @Effect()
  createCharge$: Observable<Action> = this.actions$
    .ofType(chargeActions.CREATE).pipe(
      map((action: chargeActions.CreateChargeAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.createChargeDefinition(payload.productId, payload.charge).pipe(
          map(() => new chargeActions.CreateChargeSuccessAction({
            resource: payload.charge,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new chargeActions.CreateChargeFailAction(error))))
      ));

  @Effect()
  updateCharge$: Observable<Action> = this.actions$
    .ofType(chargeActions.UPDATE).pipe(
      map((action: chargeActions.UpdateChargeAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.changeChargeDefinition(payload.productId, payload.charge).pipe(
          map(() => new chargeActions.UpdateChargeSuccessAction({
            resource: payload.charge,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new chargeActions.UpdateChargeFailAction(error))))
      ));

  @Effect()
  deleteCharge$: Observable<Action> = this.actions$
    .ofType(chargeActions.DELETE).pipe(
      map((action: chargeActions.DeleteChargeAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.deleteChargeDefinition(payload.productId, payload.charge.identifier).pipe(
          map(() => new chargeActions.DeleteChargeSuccessAction({
            resource: payload.charge,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new chargeActions.DeleteChargeFailAction(error))))
      ));

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }
}
