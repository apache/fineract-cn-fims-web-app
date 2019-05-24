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
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import * as taskActions from '../task.actions';
import {PortfolioService} from '../../../../../services/portfolio/portfolio.service';
import {TaskInstance} from '../../../../../services/portfolio/domain/task-instance.model';
import {TaskDefinition} from '../../../../../services/portfolio/domain/task-definition.model';
import {FimsTaskInstance} from '../../model/fims-task-instance.model';
import { combineLatest } from 'rxjs';
import {switchMap, map, catchError, mergeMap} from 'rxjs/operators';

@Injectable()
export class CaseTasksApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.LOAD_ALL),
    map((action: taskActions.LoadAllAction) => action.payload),
    switchMap(payload => {
      return combineLatest(
        this.portfolioService.findAllTaskDefinitionsForProduct(payload.productId),
        this.portfolioService.findAllTasksForCase(payload.productId, payload.caseId, true),
        (definitions, tasks) => ({
          definitions,
          tasks
        })
      ).map(result => this.mapTaskInstances(result.tasks, result.definitions))
       .map(taskInstances => new taskActions.LoadAllCompleteAction(taskInstances))
       .pipe(catchError(() => of(new taskActions.LoadAllCompleteAction([]))));
    }),);

  @Effect()
  executeTask$: Observable<Action> = this.actions$
    .pipe(ofType(taskActions.EXECUTE_TASK),
    map((action: taskActions.ExecuteTaskAction) => action.payload),
    mergeMap(payload => this.portfolioService.taskForCaseExecuted(payload.productIdentifier, payload.caseIdentifier,
      payload.taskIdentifier, payload.executed).pipe(
      map(() => new taskActions.ExecuteTaskActionSuccess(payload)))
      .pipe(catchError(error => of(new taskActions.ExecuteTaskActionFail(error))))));

  private mapTaskInstances(taskInstances: TaskInstance[], taskDefinitions: TaskDefinition[]): FimsTaskInstance[] {
    return taskInstances.map(instance => ({
      taskDefinition: taskDefinitions.find(definition => definition.identifier === instance.taskIdentifier),
      comment: instance.comment,
      executedOn: instance.executedOn,
      executedBy: instance.executedBy
    }));
  }

  constructor(private actions$: Actions, private portfolioService: PortfolioService) {}
}
