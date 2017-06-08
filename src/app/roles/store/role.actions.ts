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
import {type} from '../../util';
import {Role} from '../../../services/identity/domain/role.model';
import {Error} from '../../../services/domain/error.model';
import {
  CreateResourceSuccessPayload, DeleteResourceSuccessPayload, LoadResourcePayload, SelectResourcePayload,
  UpdateResourceSuccessPayload
} from '../../../common/store/resource.reducer';
import {RoutePayload} from '../../../common/store/route-payload';

export const LOAD = type('[Role] Load');
export const SELECT = type('[Role] Select');

export const CREATE = type('[Role] Create');
export const CREATE_SUCCESS = type('[Role] Create Success');
export const CREATE_FAIL = type('[Role] Create Fail');

export const UPDATE = type('[Role] Update');
export const UPDATE_SUCCESS = type('[Role] Update Success');
export const UPDATE_FAIL = type('[Role] Update Fail');

export const DELETE = type('[Role] Delete');
export const DELETE_SUCCESS = type('[Role] Delete Success');
export const DELETE_FAIL = type('[Role] Delete Fail');

export const RESET_FORM = type('[Role] Reset Form');

export interface RoleRoutePayload extends RoutePayload {
  role: Role;
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateRoleAction implements Action {
  readonly type = CREATE;

  constructor(public payload: RoleRoutePayload) { }
}

export class CreateRoleSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateRoleFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateRoleAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: RoleRoutePayload) { }
}

export class UpdateRoleSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateRoleFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class DeleteRoleAction implements Action {
  readonly type = DELETE;

  constructor(public payload: RoleRoutePayload) { }
}

export class DeleteRoleSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: DeleteResourceSuccessPayload) { }
}

export class DeleteRoleFailAction implements Action {
  readonly type = DELETE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetRoleFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAction
  | SelectAction
  | CreateRoleAction
  | CreateRoleSuccessAction
  | CreateRoleFailAction
  | UpdateRoleAction
  | UpdateRoleSuccessAction
  | UpdateRoleFailAction
  | DeleteRoleAction
  | DeleteRoleSuccessAction
  | DeleteRoleFailAction
  | ResetRoleFormAction;
