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
import {Action} from '@ngrx/store';
import {type} from '../../store/util';
import {Error} from '../../services/domain/error.model';
import {Group} from '../../services/group/domain/group.model';
import {RoutePayload} from '../../common/store/route-payload';
import {
  CreateResourceSuccessPayload,
  LoadResourcePayload,
  SelectResourcePayload,
  UpdateResourceSuccessPayload
} from '../../common/store/resource.reducer';

export const LOAD = type('[Group] Load');
export const SELECT = type('[Group] Select');

export const CREATE = type('[Group] Create');
export const CREATE_SUCCESS = type('[Group] Create Success');
export const CREATE_FAIL = type('[Group] Create Fail');

export const UPDATE = type('[Group] Update');
export const UPDATE_SUCCESS = type('[Group] Update Success');
export const UPDATE_FAIL = type('[Group] Update Fail');

export const RESET_FORM = type('[Group] Reset Form');

export interface GroupRoutePayload extends RoutePayload {
  group: Group;
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateGroupAction implements Action {
  readonly type = CREATE;

  constructor(public payload: GroupRoutePayload) { }
}

export class CreateGroupSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateGroupFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateGroupAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: GroupRoutePayload) { }
}

export class UpdateGroupSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateGroupFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetGroupFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAction
  | SelectAction
  | CreateGroupAction
  | CreateGroupSuccessAction
  | CreateGroupFailAction
  | UpdateGroupAction
  | UpdateGroupSuccessAction
  | UpdateGroupFailAction
  | ResetGroupFormAction;
