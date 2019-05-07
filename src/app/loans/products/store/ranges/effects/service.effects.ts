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
import * as resourceActions from '../../../../../common/store/action-creator/actions';
import { PortfolioService } from '../../../../../services/portfolio/portfolio.service';
import { RangeActions } from '../range.actions';
import { FimsRange } from '../../../../../services/portfolio/domain/range-model';
import { map, debounceTime, skip, takeUntil, switchMap, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class ProductChargeRangesApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(RangeActions.LOAD_ALL)
    .pipe(
      debounceTime(300),
      map((action: resourceActions.LoadAllAction) => action.payload),
      switchMap(id => {
        const nextSearch$ = this.actions$.ofType(RangeActions.LOAD_ALL).pipe(skip(1));

        return this.portfolioService.findAllRanges(id)
          .pipe(
            takeUntil(nextSearch$),
            map(resources => RangeActions.loadAllCompleteAction({
              resources
            })),
            catchError(() => of(RangeActions.loadAllCompleteAction({
              resources: []
            }))));
      }));

  @Effect()
  createRange$: Observable<Action> = this.actions$
    .ofType(RangeActions.CREATE).pipe(
      map((action: resourceActions.ResourceAction<FimsRange>) => action.payload),
      mergeMap(payload =>
        this.portfolioService.createRange(payload.data.productIdentifier, payload.resource).pipe(
          map(() => RangeActions.createSuccessAction(payload)),
          catchError((error) => of(RangeActions.createFailAction({
            resource: payload.resource,
            data: payload.data,
            error
          }))))
      ));

  @Effect()
  updateRange$: Observable<Action> = this.actions$
    .ofType(RangeActions.UPDATE).pipe(
      map((action: resourceActions.ResourceAction<FimsRange>) => action.payload),
      mergeMap(payload =>
        this.portfolioService.changeRange(payload.data.productIdentifier, payload.resource).pipe(
          map(() => RangeActions.updateSuccessAction(payload)),
          catchError((error) => of(RangeActions.updateFailAction({
            resource: payload.resource,
            data: payload.data,
            error
          }))))
      ));

  @Effect()
  deleteRange$: Observable<Action> = this.actions$
    .ofType(RangeActions.DELETE).pipe(
      map((action: resourceActions.ResourceAction<FimsRange>) => action.payload),
      mergeMap(payload =>
        this.portfolioService.deleteRange(payload.data.productIdentifier, payload.resource.identifier).pipe(
          map(() => RangeActions.deleteSuccessAction(payload)),
          catchError((error) => of(RangeActions.deleteFailAction({
            resource: payload.resource,
            data: payload.data,
            error
          }))))
      ));

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }

}
