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

import {type} from '../../../../util';
import {Action} from '@ngrx/store';
import {TransactionType} from '../../../../../services/accounting/domain/transaction-type.model';
import {RoutePayload} from '../../../../../common/store/route-payload';
import {SearchPayload, SearchResult} from '../../../../../common/store/search.reducer';
import {
  CreateResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload, UpdateResourceSuccessPayload
} from '../../../../../common/store/resource.reducer';

export const SEARCH = type('[Transaction Type] Search');
export const SEARCH_COMPLETE = type('[Transaction Type] Search Complete');

export const LOAD = type('[Transaction Type] Load');
export const SELECT = type('[Transaction Type] Select');

export const CREATE = type('[Transaction Type] Create');
export const CREATE_SUCCESS = type('[Transaction Type] Create Success');
export const CREATE_FAIL = type('[Transaction Type] Create Fail');

export const UPDATE = type('[Transaction Type] Update');
export const UPDATE_SUCCESS = type('[Transaction Type] Update Success');
export const UPDATE_FAIL = type('[Transaction Type] Update Fail');

export const RESET_FORM = type('[Transaction Type] Reset Form');

export interface TransactionTypePayload extends RoutePayload {
  transactionType: TransactionType;
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: SearchPayload) { }
}

export class SearchCompleteAction implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: SearchResult) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateTransactionTypeAction implements Action {
  readonly type = CREATE;

  constructor(public payload: TransactionTypePayload) { }
}

export class CreateTransactionTypeSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateTransactionTypeFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateTransactionTypeAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: TransactionTypePayload) { }
}

export class UpdateTransactionTypeSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateTransactionTypeFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetTransactionTypeFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = SearchAction
  | SearchCompleteAction
  | LoadAction
  | SelectAction
  | CreateTransactionTypeAction
  | CreateTransactionTypeSuccessAction
  | CreateTransactionTypeFailAction
  | UpdateTransactionTypeAction
  | UpdateTransactionTypeSuccessAction
  | UpdateTransactionTypeFailAction
  | ResetTransactionTypeFormAction;
