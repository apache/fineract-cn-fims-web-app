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
import * as taskActions from '../task.actions';
import { PortfolioService } from '../../../../../services/portfolio/portfolio.service';
import { map, debounceTime, catchError, mergeMap, switchMap, skip, takeUntil } from 'rxjs/operators';

@Injectable()
export class ProductTasksApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(taskActions.LOAD_ALL)
    .pipe(
      debounceTime(300),
      map((action: taskActions.LoadAllAction) => action.payload),
      switchMap(id => {
        const nextSearch$ = this.actions$.ofType(taskActions.LOAD_ALL).pipe(skip(1));

        return this.portfolioService.findAllTaskDefinitionsForProduct(id)
          .pipe(
            takeUntil(nextSearch$),
            map(taskDefinitions => new taskActions.LoadAllCompleteAction(taskDefinitions)),
            catchError(() => of(new taskActions.LoadAllCompleteAction([]))));
      }));

  @Effect()
  createTask$: Observable<Action> = this.actions$
    .ofType(taskActions.CREATE).pipe(
      map((action: taskActions.CreateTaskAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.createTaskDefinition(payload.productId, payload.task).pipe(
          map(() => new taskActions.CreateTaskSuccessAction({
            resource: payload.task,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new taskActions.CreateTaskFailAction(error))))
      ));

  @Effect()
  updateTask$: Observable<Action> = this.actions$
    .ofType(taskActions.UPDATE).pipe(
      map((action: taskActions.UpdateTaskAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.changeTaskDefinition(payload.productId, payload.task).pipe(
          map(() => new taskActions.UpdateTaskSuccessAction({
            resource: payload.task,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new taskActions.UpdateTaskFailAction(error))))
      ));

  @Effect()
  deleteTask$: Observable<Action> = this.actions$
    .ofType(taskActions.DELETE).pipe(
      map((action: taskActions.DeleteTaskAction) => action.payload),
      mergeMap(payload =>
        this.portfolioService.deleteTaskDefinition(payload.productId, payload.task.identifier).pipe(
          map(() => new taskActions.DeleteTaskSuccessAction({
            resource: payload.task,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new taskActions.DeleteTaskFailAction(error))))
      ));

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }
}
