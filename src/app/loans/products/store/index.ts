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
import * as fromProductSearch from './search.reducer';
import * as fromProductForm from './form.reducer';
import * as fromProductTasks from './tasks/tasks.reducer';
import * as fromProductTaskForm from './tasks/form.reducer';
import * as fromProductCharges from './charges/charges.reducer';
import * as fromProductChargeForm from './charges/form.reducer';
import {
  createResourceReducer, getResourceAll, getResourceEntities, getResourceIds, getResourceLoadedAt, getResourceSelected,
  getResourceSelectedId,
  ResourceState
} from '../../../../components/store/resource.reducer';
import {
  createSearchReducer, getSearchEntities, getSearchTotalElements, getSearchTotalPages,
  SearchState
} from '../../../../components/store/search.reducer';

export interface State extends fromRoot.State {
  products: ResourceState;
  productSearch: SearchState;
  productForm: fromProductForm.State;
  productTasks: ResourceState;
  productTaskForm: fromProductTaskForm.State;
  productCharges: ResourceState;
  productChargeForm: fromProductChargeForm.State;
}

const reducers = {
  products: createResourceReducer('Product', fromProducts.reducer),
  productSearch: createSearchReducer('Product'),
  productForm: fromProductForm.reducer,
  productTasks: createResourceReducer('Product Task', fromProductTasks.reducer),
  productTaskForm: fromProductTaskForm.reducer,
  productCharges: createResourceReducer('Product Charge', fromProductCharges.reducer),
  productChargeForm: fromProductChargeForm.reducer
};

export const portfolioModuleReducer: ActionReducer<State> = createReducer(reducers);

export class PortfolioStore extends Store<State> {
}

export function portfolioStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(portfolioModuleReducer);
  return appStore;
}

/**
 * Product selectors
 */
export const getProductsState = (state: State) => state.products;

export const getProductFormState = (state: State) => state.productForm;

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

/**
 * Product Task Selectors
 */
export const getProductTasksState = (state: State) => state.productTasks;

export const getProductTaskFormState = (state: State) => state.productTaskForm;

export const getProductTaskEntities = createSelector(getProductTasksState, getResourceEntities);
export const getProductTasksLoadedAt = createSelector(getProductTasksState, getResourceLoadedAt);
export const getProductTaskIds = createSelector(getProductTasksState, getResourceIds);
export const getSelectedProductTaskId = createSelector(getProductTasksState, getResourceSelectedId);
export const getSelectedProductTask = createSelector(getProductTasksState, getResourceSelected);

export const getAllProductTaskEntities = createSelector(getProductTasksState, getResourceAll);

/**
 * Product Charge Selectors
 */
export const getProductChargesState = (state: State) => state.productCharges;

export const getProductChargeFormState = (state: State) => state.productChargeForm;

export const getProductChargeEntities = createSelector(getProductChargesState, getResourceEntities);
export const getProductChargesLoadedAt = createSelector(getProductChargesState, getResourceLoadedAt);
export const getProductChargeIds = createSelector(getProductChargesState, getResourceIds);
export const getSelectedProductChargeId = createSelector(getProductChargesState, getResourceSelectedId);
export const getSelectedProductCharge = createSelector(getProductChargesState, getResourceSelected);

export const getAllProductChargeEntities = createSelector(getProductChargesState, getResourceAll);
