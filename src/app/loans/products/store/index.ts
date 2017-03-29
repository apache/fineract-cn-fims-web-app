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

export interface State extends fromRoot.State{
  products: fromProducts.State;
  productSearch: fromProductSearch.State;
  productForm: fromProductForm.State;
  productTasks: fromProductTasks.State;
  productTaskForm: fromProductTaskForm.State;
  productCharges: fromProductCharges.State;
  productChargeForm: fromProductChargeForm.State;
}

const reducers = {
  products: fromProducts.reducer,
  productSearch: fromProductSearch.reducer,
  productForm: fromProductForm.reducer,
  productTasks: fromProductTasks.reducer,
  productTaskForm: fromProductTaskForm.reducer,
  productCharges: fromProductCharges.reducer,
  productChargeForm: fromProductChargeForm.reducer
};

export const portfolioModuleReducer: ActionReducer<State> = createReducer(reducers);

export class PortfolioStore extends Store<State>{}

export function portfolioStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(portfolioModuleReducer);
  return appStore;
}

/**
 * Product selectors
 */
export const getProductsState = (state: State) => state.products;

export const getProductFormState = (state: State) => state.productForm;

export const getProductEntities = createSelector(getProductsState, fromProducts.getEntities);
export const getProductIds = createSelector(getProductsState, fromProducts.getIds);
export const getSelectedProductId = createSelector(getProductsState, fromProducts.getSelectedId);
export const getSelectedProduct = createSelector(getProductsState, fromProducts.getSelected);

/**
 * Product search selector
 */
export const getProductSearchState = (state: State) => state.productSearch;

export const getSearchProducts = createSelector(getProductSearchState, fromProductSearch.getProducts);
export const getProductSearchTotalElements = createSelector(getProductSearchState, fromProductSearch.getTotalElements);
export const getProductSearchTotalPages = createSelector(getProductSearchState, fromProductSearch.getTotalPages);

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

export const getProductTaskEntities = createSelector(getProductTasksState, fromProductTasks.getEntities);
export const getProductTaskIds = createSelector(getProductTasksState, fromProductTasks.getIds);
export const getSelectedProductTaskId = createSelector(getProductTasksState, fromProductTasks.getSelectedId);
export const getSelectedProductTask = createSelector(getProductTasksState, fromProductTasks.getSelected);

export const getAllProductTaskEntities = createSelector(getProductTasksState, fromProductTasks.getAll);

/**
 * Product Charge Selectors
 */
export const getProductChargesState = (state: State) => state.productCharges;

export const getProductChargeFormState = (state: State) => state.productChargeForm;

export const getProductChargeEntities = createSelector(getProductChargesState, fromProductCharges.getEntities);
export const getProductChargeIds = createSelector(getProductChargesState, fromProductCharges.getIds);
export const getSelectedProductChargeId = createSelector(getProductChargesState, fromProductCharges.getSelectedId);
export const getSelectedProductCharge = createSelector(getProductChargesState, fromProductCharges.getSelected);

export const getAllProductChargeEntities = createSelector(getProductChargesState, fromProductCharges.getAll);
