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
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as taskActions from '../task.actions';
import {CustomerService} from '../../../../../services/customer/customer.service';

@Injectable()
export class CustomerTasksApiEffects {

  constructor(private actions$: Actions, private customerService: CustomerService) { }

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(taskActions.LOAD_ALL)
    .debounceTime(300)
    .map((action: taskActions.LoadAllAction) => action.payload)
    .switchMap(id => {
      const nextSearch$ = this.actions$.ofType(taskActions.LOAD_ALL).skip(1);

      return this.customerService.fetchCustomerTasks(id)
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
  executeTask: Observable<Action> = this.actions$
    .ofType(taskActions.EXECUTE_TASK)
    .map((action: taskActions.ExecuteTaskAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.markTaskAsExecuted(payload.customerId, payload.taskId)
        .map(() => new taskActions.ExecuteTaskSuccessAction(payload))
        .catch((error) => of(new taskActions.ExecuteTaskFailAction(error)))
    );

  @Effect()
  executeCommand: Observable<Action> = this.actions$
    .ofType(taskActions.EXECUTE_COMMAND)
    .map((action: taskActions.ExecuteCommandAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.executeCustomerCommand(payload.customerId, payload.command)
        .map(() => new taskActions.ExecuteCommandSuccessAction(payload))
        .catch((error) => of(new taskActions.ExecuteCommandFailAction(error)))
    );

  @Effect()
  addTask: Observable<Action> = this.actions$
    .ofType(taskActions.ADD_TASK_TO_CUSTOMER)
    .map((action: taskActions.AddCustomerTaskAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.addTaskToCustomer(payload.customerId, payload.taskId)
        .map(() => new taskActions.AddCustomerTaskSuccessAction(payload))
        .catch((error) => of(new taskActions.AddCustomerTaskFailAction(error)))
    );
}
