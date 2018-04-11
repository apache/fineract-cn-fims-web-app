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
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../store/index';
import {createFormReducer, FormState, getFormError} from '../../common/store/form.reducer';
import {createResourceReducer, getResourceLoadedAt, getResourceSelected, ResourceState} from '../../common/store/resource.reducer';

import * as fromRoot from '../../store';
import * as fromProducts from './products.reducer';
import * as fromDividends from './dividends/dividends.reducer';
import {createSelector} from 'reselect';
import {
  createSearchReducer,
  getSearchEntities,
  getSearchTotalElements,
  getSearchTotalPages,
  SearchState
} from '../../common/store/search.reducer';

export interface State extends fromRoot.State {
  depositProducts: ResourceState;
  depositProductForm: FormState;
  depositProductSearch: SearchState;
  depositProductDividends: fromDividends.State;
}

const reducers = {
  depositProducts: createResourceReducer('Deposit Product Definition', fromProducts.reducer),
  depositProductForm: createFormReducer('Deposit Product Definition'),
  depositProductSearch: createSearchReducer('Deposit Product Definition'),
  depositProductDividends: fromDividends.reducer
};

export const depositAccountModuleReducer: ActionReducer<State> = createReducer(reducers);

export class DepositAccountStore extends Store<State> {}

export function depositAccountStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(depositAccountModuleReducer);
  return appStore;
}

export const getProductsState = (state: State) => state.depositProducts;

export const getProductFormState = (state: State) => state.depositProductForm;
export const getProductFormError = createSelector(getProductFormState, getFormError);

export const getProductsLoadedAt = createSelector(getProductsState, getResourceLoadedAt);
export const getSelectedProduct = createSelector(getProductsState, getResourceSelected);

/**
 * Product search selector
 */
export const getProductSearchState = (state: State) => state.depositProductSearch;

export const getSearchProducts = createSelector(getProductSearchState, getSearchEntities);
export const getProductSearchTotalElements = createSelector(getProductSearchState, getSearchTotalElements);
export const getProductSearchTotalPages = createSelector(getProductSearchState, getSearchTotalPages);

export const getProductSearchResults = createSelector(getSearchProducts, getProductSearchTotalPages, getProductSearchTotalElements,
  (products, totalPages, totalElements) => {
  return {
    products: products,
    totalPages: totalPages,
    totalElements: totalElements
  };
});


export const getProductDividendsState = (state: State) => state.depositProductDividends;

export const getDividends = createSelector(getProductDividendsState, fromDividends.getDividends);
