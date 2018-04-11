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
import {Actions, Effect} from '@ngrx/effects';
import {CustomerService} from '../../../../services/customer/customer.service';
import * as taskActions from '../task.actions';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';

@Injectable()
export class TasksApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(taskActions.LOAD_ALL)
    .debounceTime(300)
    .map((action: taskActions.LoadAllAction) => action.payload)
    .switchMap(() => {
      const nextSearch$ = this.actions$.ofType(taskActions.LOAD_ALL).skip(1);

      return this.customerService.fetchTasks()
        .takeUntil(nextSearch$)
        .map(taskPage => new taskActions.LoadAllCompleteAction(taskPage))
        .catch(() => of(new taskActions.LoadAllCompleteAction([])));
    });

  @Effect()
  createTask$: Observable<Action> = this.actions$
    .ofType(taskActions.CREATE)
    .map((action: taskActions.CreateTaskAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.createTask(payload.task)
        .map(() => new taskActions.CreateTaskSuccessAction({
          resource: payload.task,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new taskActions.CreateTaskFailAction(error)))
    );

  @Effect()
  updateTask$: Observable<Action> = this.actions$
    .ofType(taskActions.UPDATE)
    .map((action: taskActions.CreateTaskAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.updateTask(payload.task)
        .map(() => new taskActions.UpdateTaskSuccessAction({
          resource: payload.task,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new taskActions.UpdateTaskFailAction(error)))
    );

  constructor(private actions$: Actions, private customerService: CustomerService) {}
}
