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
import { Actions, Effect,ofType } from '@ngrx/effects';
import { CustomerService } from '../../../../services/customer/customer.service';
import * as taskActions from '../task.actions';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, debounceTime, skip, takeUntil, mergeMap, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class TasksApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.LOAD_ALL),
      debounceTime(300),
      map((action: taskActions.LoadAllAction) => action.payload),
      switchMap(() => {
        const nextSearch$ = this.actions$.pipe(ofType(taskActions.LOAD_ALL),(skip(1)));

        return this.customerService.fetchTasks()
          .pipe(
            takeUntil(nextSearch$),
            map(taskPage => new taskActions.LoadAllCompleteAction(taskPage)),
            catchError(() => of(new taskActions.LoadAllCompleteAction([]))));
      }));

  @Effect()
  createTask$: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.CREATE),
      map((action: taskActions.CreateTaskAction) => action.payload),
      mergeMap(payload =>
        this.customerService.createTask(payload.task).pipe(
          map(() => new taskActions.CreateTaskSuccessAction({
            resource: payload.task,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new taskActions.CreateTaskFailAction(error))))
      ));

  @Effect()
  updateTask$: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.UPDATE),
      map((action: taskActions.CreateTaskAction) => action.payload),
      mergeMap(payload =>
        this.customerService.updateTask(payload.task).pipe(
          map(() => new taskActions.UpdateTaskSuccessAction({
            resource: payload.task,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new taskActions.UpdateTaskFailAction(error))))
      ));

  constructor(private actions$: Actions, private customerService: CustomerService) { }
}
