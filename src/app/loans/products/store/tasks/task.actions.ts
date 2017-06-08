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

import {Action} from '@ngrx/store';
import {Error} from '../../../../../services/domain/error.model';
import {type} from '../../../../util';
import {TaskDefinition} from '../../../../../services/portfolio/domain/task-definition.model';
import {RoutePayload} from '../../../../../common/store/route-payload';
import {
  CreateResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload, UpdateResourceSuccessPayload
} from '../../../../../common/store/resource.reducer';

export const LOAD_ALL = type('[Product Task] Load All');
export const LOAD_ALL_COMPLETE = type('[Product Task] Load All Complete');

export const LOAD = type('[Product Task] Load');
export const SELECT = type('[Product Task] Select');

export const CREATE = type('[Product Task] Create');
export const CREATE_SUCCESS = type('[Product Task] Create Success');
export const CREATE_FAIL = type('[Product Task] Create Fail');

export const UPDATE = type('[Product Task] Update');
export const UPDATE_SUCCESS = type('[Product Task] Update Success');
export const UPDATE_FAIL = type('[Product Task] Update Fail');

export const RESET_FORM = type('[Product Task] Reset Form');

export interface TaskRoutePayload extends RoutePayload{
  productId: string;
  task: TaskDefinition;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: string) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: TaskDefinition[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateTaskAction implements Action {
  readonly type = CREATE;

  constructor(public payload: TaskRoutePayload) { }
}

export class CreateTaskSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateTaskFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateTaskAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: TaskRoutePayload) { }
}

export class UpdateTaskSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateTaskFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetTaskFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | CreateTaskAction
  | CreateTaskSuccessAction
  | CreateTaskFailAction
  | UpdateTaskAction
  | UpdateTaskSuccessAction
  | UpdateTaskFailAction
  | ResetTaskFormAction;
