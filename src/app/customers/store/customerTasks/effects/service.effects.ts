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
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as taskActions from '../customer-task.actions';
import { CustomerService } from '../../../../services/customer/customer.service';
import { map, debounceTime, mergeMap, skip, takeUntil, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class CustomerTasksApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.LOAD_ALL),
      debounceTime(300),
      map((action: taskActions.LoadAllAction) => action.payload),
      switchMap(id => {
        const nextSearch$ = this.actions$.pipe(ofType(taskActions.LOAD_ALL),(skip(1)));

        return this.customerService.fetchProcessSteps(id)
          .pipe(
            takeUntil(nextSearch$),
            map(processSteps => new taskActions.LoadAllCompleteAction(processSteps)),
            catchError(() => of(new taskActions.LoadAllCompleteAction([]))));
      }));

  @Effect()
  executeTask: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.EXECUTE_TASK),
      map((action: taskActions.ExecuteTaskAction) => action.payload),
      mergeMap(payload =>
        this.customerService.markTaskAsExecuted(payload.customerId, payload.taskId).pipe(
          map(() => new taskActions.ExecuteTaskSuccessAction(payload)),
          catchError((error) => of(new taskActions.ExecuteTaskFailAction(error))))
      ));

  @Effect()
  executeCommand: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.EXECUTE_COMMAND),
      map((action: taskActions.ExecuteCommandAction) => action.payload),
      mergeMap(payload =>
        this.customerService.executeCustomerCommand(payload.customerId, payload.command).pipe(
          map(() => new taskActions.ExecuteCommandSuccessAction(payload)),
          catchError((error) => of(new taskActions.ExecuteCommandFailAction(error))))
      ));

  constructor(private actions$: Actions, private customerService: CustomerService) { }

}
