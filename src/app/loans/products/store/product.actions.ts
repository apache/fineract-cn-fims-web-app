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
import {Error} from '../../../../services/domain/error.model';
import {type} from '../../../util';
import {RoutePayload} from '../../../../common/store/route-payload';
import {FimsProduct} from './model/fims-product.model';
import {SearchResult} from '../../../../common/store/search.reducer';
import {
  CreateResourceSuccessPayload, DeleteResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload, UpdateResourceSuccessPayload
} from '../../../../common/store/resource.reducer';
import {AccountAssignment} from '../../../../services/portfolio/domain/account-assignment.model';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';

export const SEARCH = type('[Product] Search');
export const SEARCH_COMPLETE = type('[Product] Search Complete');

export const LOAD = type('[Product] Load');
export const SELECT = type('[Product] Select');

export const CREATE = type('[Product] Create');
export const CREATE_SUCCESS = type('[Product] Create Success');
export const CREATE_FAIL = type('[Product] Create Fail');

export const UPDATE = type('[Product] Update');
export const UPDATE_SUCCESS = type('[Product] Update Success');
export const UPDATE_FAIL = type('[Product] Update Fail');

export const DELETE = type('[Product] Delete');
export const DELETE_SUCCESS = type('[Product] Delete Success');
export const DELETE_FAIL = type('[Product] Delete Fail');

export const ENABLE = type('[Product] Enable');
export const ENABLE_SUCCESS = type('[Product] Enable Success');
export const ENABLE_FAIL = type('[Product] Enable Fail');

export const RESET_FORM = type('[Product] Reset Form');

export interface ProductRoutePayload extends RoutePayload {
  product: FimsProduct
}

export interface EnableProductPayload {
  product: FimsProduct;
  enable: boolean;
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(payload: FetchRequest) { }
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

export class CreateProductAction implements Action {
  readonly type = CREATE;

  constructor(public payload: ProductRoutePayload) { }
}

export class CreateProductSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateProductFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateProductAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: ProductRoutePayload) { }
}

export class UpdateProductSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateProductFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class DeleteProductAction implements Action {
  readonly type = DELETE;

  constructor(public payload: ProductRoutePayload) { }
}

export class DeleteProductSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: DeleteResourceSuccessPayload) { }
}

export class DeleteProductFailAction implements Action {
  readonly type = DELETE_FAIL;

  constructor(public payload: Error) { }
}

export class EnableProductAction implements Action {
  readonly type = ENABLE;

  constructor(public payload: EnableProductPayload) { }
}

export class EnableProductSuccessAction implements Action {
  readonly type = ENABLE_SUCCESS;

  constructor(public payload: EnableProductPayload) { }
}

export class EnableProductFailAction implements Action {
  readonly type = ENABLE_FAIL;

  constructor(public payload: AccountAssignment[]) { }
}

export class ResetProductFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = SearchAction
  | SearchCompleteAction
  | LoadAction
  | SelectAction
  | CreateProductAction
  | CreateProductSuccessAction
  | CreateProductFailAction
  | UpdateProductAction
  | UpdateProductSuccessAction
  | UpdateProductFailAction
  | DeleteProductAction
  | DeleteProductSuccessAction
  | DeleteProductFailAction
  | EnableProductAction
  | EnableProductSuccessAction
  | EnableProductFailAction;
