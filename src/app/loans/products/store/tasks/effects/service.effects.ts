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
import {PortfolioService} from '../../../../../../services/portfolio/portfolio.service';

@Injectable()
export class ProductTasksApiEffects {

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(taskActions.LOAD_ALL)
    .debounceTime(300)
    .map((action: taskActions.LoadAllAction) => action.payload)
    .switchMap(id => {
      const nextSearch$ = this.actions$.ofType(taskActions.LOAD_ALL).skip(1);

      return this.portfolioService.findAllTaskDefinitionsForProduct(id)
        .takeUntil(nextSearch$)
        .map(taskDefinitions => new taskActions.LoadAllCompleteAction(taskDefinitions))
        .catch(() => of(new taskActions.LoadAllCompleteAction([])));
    });

  @Effect()
  createTask$: Observable<Action> = this.actions$
    .ofType(taskActions.CREATE)
    .map((action: taskActions.CreateTaskAction) => action.payload)
    .mergeMap(payload =>
      this.portfolioService.createTaskDefinition(payload.productId, payload.task)
        .map(() => new taskActions.CreateTaskSuccessAction({
          resource: payload.task,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new taskActions.CreateTaskFailAction(error)))
    );

  @Effect()
  updateTask$: Observable<Action> = this.actions$
    .ofType(taskActions.UPDATE)
    .map((action: taskActions.UpdateTaskAction) => action.payload)
    .mergeMap(payload =>
      this.portfolioService.changeTaskDefinition(payload.productId, payload.task)
        .map(() => new taskActions.UpdateTaskSuccessAction({
          resource: payload.task,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new taskActions.UpdateTaskFailAction(error)))
    );
}
