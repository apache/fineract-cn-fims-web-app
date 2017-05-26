import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createFormReducer, FormState, getFormError} from '../../../components/store/form.reducer';
import {
  createResourceReducer, getResourceEntities, getResourceIds, getResourceLoadedAt, getResourceSelected,
  getResourceSelectedId,
  ResourceState
} from '../../../components/store/resource.reducer';
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

import * as fromRoot from '../../reducers';
import {createSelector} from 'reselect';
import {
  createSearchReducer, getSearchEntities, getSearchTotalElements, getSearchTotalPages,
  SearchState
} from '../../../components/store/search.reducer';

export interface State extends fromRoot.State{
  products: ResourceState;
  productForm: FormState;
  productSearch: SearchState;
}

const reducers = {
  products: createResourceReducer('Deposit Product Definition'),
  productForm: createFormReducer('Deposit Product Definition'),
  productSearch: createSearchReducer('Deposit Product Definition'),
};

export const depositAccountModuleReducer: ActionReducer<State> = createReducer(reducers);

export class DepositAccountStore extends Store<State>{}

export function depositAccountStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(depositAccountModuleReducer);
  return appStore;
}

export const getProductsState = (state: State) => state.products;

export const getProductFormState = (state: State) => state.productForm;
export const getProductFormError = createSelector(getProductFormState, getFormError);

export const getProductEntities = createSelector(getProductsState, getResourceEntities);
export const getProductsLoadedAt = createSelector(getProductsState, getResourceLoadedAt);
export const getProductIds = createSelector(getProductsState, getResourceIds);
export const getSelectedProductId = createSelector(getProductsState, getResourceSelectedId);
export const getSelectedProduct = createSelector(getProductsState, getResourceSelected);

/**
 * Product search selector
 */
export const getProductSearchState = (state: State) => state.productSearch;

export const getSearchProducts = createSelector(getProductSearchState, getSearchEntities);
export const getProductSearchTotalElements = createSelector(getProductSearchState, getSearchTotalElements);
export const getProductSearchTotalPages = createSelector(getProductSearchState, getSearchTotalPages);

export const getProductSearchResults = createSelector(getSearchProducts, getProductSearchTotalPages, getProductSearchTotalElements, (products, totalPages, totalElements) => {
  return {
    products: products,
    totalPages: totalPages,
    totalElements: totalElements
  };
});
