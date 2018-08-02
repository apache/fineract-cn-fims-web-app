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
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as groupActions from '../definition.actions';
import {GroupService} from '../../../../services/group/group.service';

@Injectable()
export class GroupDefinitionApiEffects {
  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(groupActions.LOAD_ALL)
    .debounceTime(300)
    .map((action: groupActions.LoadAllAction) => action.payload)
    .switchMap(() => {
      const nextSearch$ = this.actions$.ofType(groupActions.LOAD_ALL).skip(1);

      return this.groupService.fetchGroupDefinitions()
        .takeUntil(nextSearch$)
        .map(groupDefinitionPage => new groupActions.LoadAllCompleteAction(groupDefinitionPage))
        .catch(() => of(new groupActions.LoadAllCompleteAction([])));
    });

  @Effect()
  createGroupDefinition$: Observable<Action> = this.actions$
    .ofType(groupActions.CREATE)
    .map((action: groupActions.CreateGroupDefinitionAction) => action.payload)
    .mergeMap(payload =>
      this.groupService.createGroupDefinition(payload.groupDefinition)
        .map(() => new groupActions.CreateGroupDefinitionSuccessAction({
          resource: payload.groupDefinition,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new groupActions.CreateGroupDefinitionFailAction(error)))
    );

  @Effect()
  updateGroupDefinition$: Observable<Action> = this.actions$
    .ofType(groupActions.UPDATE)
    .map((action: groupActions.UpdateGroupDefinitionAction) => action.payload)
    .mergeMap(payload =>
      this.groupService.updateGroupDefinition(payload.groupDefinition)
        .map(() => new groupActions.UpdateGroupDefinitionSuccessAction({
          resource: payload.groupDefinition,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new groupActions.UpdateGroupDefinitionFailAction(error)))
    );

  constructor(private actions$: Actions, private groupService: GroupService) {}
}
