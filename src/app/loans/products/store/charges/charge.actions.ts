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
import {RoutePayload} from '../../../../../common/store/route-payload';
import {ChargeDefinition} from '../../../../../services/portfolio/domain/charge-definition.model';
import {
  CreateResourceSuccessPayload, DeleteResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload, UpdateResourceSuccessPayload
} from '../../../../../common/store/resource.reducer';

export const LOAD_ALL = type('[Product Charge] Load All');
export const LOAD_ALL_COMPLETE = type('[Product Charge] Load All Complete');

export const LOAD = type('[Product Charge] Load');
export const SELECT = type('[Product Charge] Select');

export const CREATE = type('[Product Charge] Create');
export const CREATE_SUCCESS = type('[Product Charge] Create Success');
export const CREATE_FAIL = type('[Product Charge] Create Fail');

export const UPDATE = type('[Product Charge] Update');
export const UPDATE_SUCCESS = type('[Product Charge] Update Success');
export const UPDATE_FAIL = type('[Product Charge] Update Fail');

export const DELETE = type('[Product Charge] Delete');
export const DELETE_SUCCESS = type('[Product Charge] Delete Success');
export const DELETE_FAIL = type('[Product Charge] Delete Fail');

export const RESET_FORM = type('[Product Charge] Reset Form');

export interface ChargeRoutePayload extends RoutePayload{
  productId: string;
  charge: ChargeDefinition;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: string) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: ChargeDefinition[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateChargeAction implements Action {
  readonly type = CREATE;

  constructor(public payload: ChargeRoutePayload) { }
}

export class CreateChargeSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateChargeFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateChargeAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: ChargeRoutePayload) { }
}

export class UpdateChargeSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateChargeFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class DeleteChargeAction implements Action {
  readonly type = DELETE;

  constructor(public payload: ChargeRoutePayload) { }
}

export class DeleteChargeSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: DeleteResourceSuccessPayload) { }
}

export class DeleteChargeFailAction implements Action {
  readonly type = DELETE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetChargeFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | CreateChargeAction
  | CreateChargeSuccessAction
  | CreateChargeFailAction
  | UpdateChargeAction
  | UpdateChargeSuccessAction
  | UpdateChargeFailAction
  | DeleteChargeAction
  | DeleteChargeSuccessAction
  | DeleteChargeFailAction
  | ResetChargeFormAction;
