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

import * as fromRoot from '../../../reducers';
import {ActionReducer, Store} from '@ngrx/store';
import {createSelector} from 'reselect';
import {createReducer} from '../../../reducers/index';
import * as fromProducts from './products.reducer';
import * as fromProductTasks from './tasks/tasks.reducer';
import * as fromProductCharges from './charges/charges.reducer';
import {
  createResourceReducer,
  getResourceAll,
  getResourceEntities,
  getResourceIds,
  getResourceLoadedAt,
  getResourceSelected,
  getResourceSelectedId,
  ResourceState
} from '../../../../common/store/resource.reducer';
import {
  createSearchReducer,
  getSearchEntities,
  getSearchTotalElements,
  getSearchTotalPages,
  SearchState
} from '../../../../common/store/search.reducer';
import {createFormReducer, FormState, getFormError} from '../../../../common/store/form.reducer';
import {FimsProduct} from './model/fims-product.model';

export interface State extends fromRoot.State {
  products: ResourceState;
  productSearch: SearchState;
  productForm: FormState;
  productTasks: ResourceState;
  productTaskForm: FormState;
  productCharges: ResourceState;
  productChargeForm: FormState;
}

const reducers = {
  products: createResourceReducer('Product', fromProducts.reducer),
  productSearch: createSearchReducer('Product'),
  productForm: createFormReducer('Product'),
  productTasks: createResourceReducer('Product Task', fromProductTasks.reducer),
  productTaskForm: createFormReducer('Product Task'),
  productCharges: createResourceReducer('Product Charge', fromProductCharges.reducer),
  productChargeForm: createFormReducer('Product Charge')
};

export const portfolioModuleReducer: ActionReducer<State> = createReducer(reducers);

export class PortfolioStore extends Store<State> {}

export function portfolioStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(portfolioModuleReducer);
  return appStore;
}

/**
 * Product selectors
 */
export const getProductsState = (state: State) => state.products;

export const getProductFormState = (state: State) => state.productForm;
export const getProductFormError = createSelector(getProductFormState, getFormError);

export const getProductsLoadedAt = createSelector(getProductsState, getResourceLoadedAt);
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

/**
 * Product Task Selectors
 */
export const getProductTasksState = (state: State) => state.productTasks;

export const getProductTaskFormState = (state: State) => state.productTaskForm;
export const getProductTaskFormError = createSelector(getProductTaskFormState, getFormError);

export const getProductTasksLoadedAt = createSelector(getProductTasksState, getResourceLoadedAt);
export const getSelectedProductTask = createSelector(getProductTasksState, getResourceSelected);

export const getAllProductTaskEntities = createSelector(getProductTasksState, getResourceAll);

/**
 * Product Charge Selectors
 */
export const getProductChargesState = (state: State) => state.productCharges;

export const getProductChargesLoadedAt = createSelector(getProductChargesState, getResourceLoadedAt);
export const getSelectedProductCharge = createSelector(getProductChargesState, getResourceSelected);

export const getAllProductChargeEntities = createSelector(getProductChargesState, getResourceAll);
