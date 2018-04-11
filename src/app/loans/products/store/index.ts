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
import * as fromRoot from '../../../store';
import {ActionReducer, Store} from '@ngrx/store';
import {createSelector} from 'reselect';
import {createReducer} from '../../../store/index';
import * as fromProducts from './products.reducer';
import * as fromProductTasks from './tasks/tasks.reducer';
import * as fromProductCharges from './charges/charges.reducer';
import * as fromProductChargeRanges from './ranges/ranges.reducer';
import * as fromProductLossProvision from './lossProvision/loss-provision.reducer';
import {getLossProvisionConfiguration, getLossProvisionConfigurationLoadedAt} from './lossProvision/loss-provision.reducer';

import {
  createResourceReducer,
  getResourceAll,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../../common/store/resource.reducer';
import {
  createSearchReducer,
  getSearchEntities,
  getSearchTotalElements,
  getSearchTotalPages,
  SearchState
} from '../../../common/store/search.reducer';
import {createFormReducer, FormState, getFormError} from '../../../common/store/form.reducer';

export interface State extends fromRoot.State {
  products: ResourceState;
  productSearch: SearchState;
  productForm: FormState;
  productTasks: ResourceState;
  productTaskForm: FormState;
  productCharges: ResourceState;
  productChargeForm: FormState;
  productChargeRanges: ResourceState;
  productLossProvision: fromProductLossProvision.State;
}

const reducers = {
  products: createResourceReducer('Product', fromProducts.reducer),
  productSearch: createSearchReducer('Product'),
  productForm: createFormReducer('Product'),
  productTasks: createResourceReducer('Product Task', fromProductTasks.reducer),
  productTaskForm: createFormReducer('Product Task'),
  productCharges: createResourceReducer('Product Charge', fromProductCharges.reducer),
  productChargeForm: createFormReducer('Product Charge'),
  productChargeRanges: createResourceReducer('Product Charge Range', fromProductChargeRanges.reducer),
  productLossProvision: fromProductLossProvision.reducer
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

export const getProductSearchResults = createSelector(getSearchProducts, getProductSearchTotalPages, getProductSearchTotalElements,
  (products, totalPages, totalElements) => {
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

/**
 * Product Charge Range Selectors
 */

export const getProductChargeRangesState = (state: State) => state.productChargeRanges;

export const getProductChargeRangesLoadedAt = createSelector(getProductChargeRangesState, getResourceLoadedAt);
export const getSelectedProductChargeRange = createSelector(getProductChargeRangesState, getResourceSelected);

export const getAllProductChargeRangeEntities = createSelector(getProductChargeRangesState, getResourceAll);

/**
 * Product Loss Configuration Selectors
 */

export const getProductLossProvisionState = (state: State) => state.productLossProvision;

export const getProductLossProvisionConfigurationLoadedAt = createSelector(
  getProductLossProvisionState, getLossProvisionConfigurationLoadedAt
);
export const getProductLossProvisionConfiguration = createSelector(getProductLossProvisionState, getLossProvisionConfiguration);
