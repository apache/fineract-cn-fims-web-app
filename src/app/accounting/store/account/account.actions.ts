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
import {type} from '../../../util';
import {Account} from '../../../../services/accounting/domain/account.model';
import {AccountPage} from '../../../../services/accounting/domain/account-page.model';
import {Error} from '../../../../services/domain/error.model';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import {ActivatedRoute} from '@angular/router';
import {RoutePayload} from '../../../../common/store/route-payload';
import {
  CreateResourceSuccessPayload, DeleteResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload, UpdateResourceSuccessPayload
} from '../../../../common/store/resource.reducer';

export const LOAD = type('[Account] Load');
export const SELECT = type('[Account] Select');

export const CREATE = type('[Account] Create');
export const CREATE_SUCCESS = type('[Account] Create Success');
export const CREATE_FAIL = type('[Account] Create Fail');

export const UPDATE = type('[Account] Update');
export const UPDATE_SUCCESS = type('[Account] Update Success');
export const UPDATE_FAIL = type('[Account] Update Fail');

export const DELETE = type('[Account] Delete');
export const DELETE_SUCCESS = type('[Account] Delete Success');
export const DELETE_FAIL = type('[Account] Delete Fail');

export const RESET_FORM = type('[Account] Reset Form');

export interface AccountRoutePayload extends RoutePayload{
  account: Account;
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateAccountAction implements Action {
  readonly type = CREATE;

  constructor(public payload: AccountRoutePayload) { }
}

export class CreateAccountSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateAccountFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateAccountAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: AccountRoutePayload) { }
}

export class UpdateAccountSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateAccountFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class DeleteAccountAction implements Action {
  readonly type = DELETE;

  constructor(public payload: AccountRoutePayload) { }
}

export class DeleteAccountSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: DeleteResourceSuccessPayload) { }
}

export class DeleteAccountFailAction implements Action {
  readonly type = DELETE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetAccountFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAction
  | SelectAction
  | CreateAccountAction
  | CreateAccountSuccessAction
  | CreateAccountFailAction
  | UpdateAccountAction
  | UpdateAccountSuccessAction
  | UpdateAccountFailAction
  | DeleteAccountAction
  | DeleteAccountSuccessAction
  | DeleteAccountFailAction
  | ResetAccountFormAction;
