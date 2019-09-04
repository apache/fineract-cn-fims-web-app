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
import { Action } from '@ngrx/store';
import { type } from '../../../store/util';
import { Error } from '../../../services/domain/error.model';
import { GroupDefinition } from '../../../services/group/domain/group-definition.model';
import { RoutePayload } from '../../../common/store/route-payload';
import {
  CreateResourceSuccessPayload,
  LoadResourcePayload,
  SelectResourcePayload,
  UpdateResourceSuccessPayload
} from '../../../common/store/resource.reducer';

export const LOAD_ALL = type('[GroupDefinition] Load All');
export const LOAD_ALL_COMPLETE = type('[GroupDefinition] Load All Complete');

export const LOAD = type('[GroupDefinition] Load');
export const SELECT = type('[GroupDefinition] Select');

export const CREATE = type('[GroupDefinition] Create');
export const CREATE_SUCCESS = type('[GroupDefinition] Create Success');
export const CREATE_FAIL = type('[GroupDefinition] Create Fail');

export const UPDATE = type('[GroupDefinition] Update');
export const UPDATE_SUCCESS = type('[GroupDefinition] Update Success');
export const UPDATE_FAIL = type('[GroupDefinition] Update Fail');

export const RESET_FORM = type('[GroupDefinition] Reset Form');

export interface GroupDefinitionRoutePayload extends RoutePayload {
  groupDefinition: GroupDefinition;
  groupDefinitionId: string;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: string) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: GroupDefinition[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateGroupDefinitionAction implements Action {
  readonly type = CREATE;

  constructor(public payload: GroupDefinitionRoutePayload) { }
}

export class CreateGroupDefinitionSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateGroupDefinitionFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateGroupDefinitionAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: GroupDefinitionRoutePayload) { }
}

export class UpdateGroupDefinitionSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateGroupDefinitionFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetGroupDefinitionFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() { }
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | CreateGroupDefinitionAction
  | CreateGroupDefinitionSuccessAction
  | CreateGroupDefinitionFailAction
  | UpdateGroupDefinitionAction
  | UpdateGroupDefinitionSuccessAction
  | UpdateGroupDefinitionFailAction
  | ResetGroupDefinitionFormAction;
