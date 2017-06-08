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
import {Error} from '../../../services/domain/error.model';
import {Customer} from '../../../services/customer/domain/customer.model';
import {RoutePayload} from '../../../common/store/route-payload';
import {
  CreateResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload, UpdateResourceSuccessPayload
} from '../../../common/store/resource.reducer';

export const LOAD = type('[Customer] Load');
export const SELECT = type('[Customer] Select');

export const CREATE = type('[Customer] Create');
export const CREATE_SUCCESS = type('[Customer] Create Success');
export const CREATE_FAIL = type('[Customer] Create Fail');

export const UPDATE = type('[Customer] Update');
export const UPDATE_SUCCESS = type('[Customer] Update Success');
export const UPDATE_FAIL = type('[Customer] Update Fail');

export const RESET_FORM = type('[Customer] Reset Form');

export interface CustomerRoutePayload extends RoutePayload{
  customer: Customer
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateCustomerAction implements Action {
  readonly type = CREATE;

  constructor(public payload: CustomerRoutePayload) { }
}

export class CreateCustomerSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateCustomerFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateCustomerAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: CustomerRoutePayload) { }
}

export class UpdateCustomerSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateCustomerFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetCustomerFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAction
  | SelectAction
  | CreateCustomerAction
  | CreateCustomerSuccessAction
  | CreateCustomerFailAction
  | UpdateCustomerAction
  | UpdateCustomerSuccessAction
  | UpdateCustomerFailAction
  | ResetCustomerFormAction;
