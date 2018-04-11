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
import * as fromRoot from '../../store';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../store/index';
import * as fromAuthentication from './authentication.reducer';
import * as fromDepositProducts from './customer-deposit-products.reducer';
import * as fromLoanProducts from './customer-loan-products.reducer';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceAll,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../common/store/resource.reducer';

export interface State extends fromRoot.State {
  tellerAuthentication: fromAuthentication.State;
  tellerCustomers: ResourceState;
  tellerCustomerDepositProducts: ResourceState;
  tellerCustomerLoanProducts: ResourceState;
}

const reducers = {
  tellerAuthentication: fromAuthentication.reducer,
  tellerCustomers: createResourceReducer('Teller Customer'),
  tellerCustomerDepositProducts: fromDepositProducts.reducer,
  tellerCustomerLoanProducts: fromLoanProducts.reducer,
};

export const tellerModuleReducer: ActionReducer<State> = createReducer(reducers);

export class TellerStore extends Store<State> {}

export function tellerStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(tellerModuleReducer);
  return appStore;
}

export const getAuthenticationState = (state: State) => state.tellerAuthentication;

export const isAuthenticated = createSelector(getAuthenticationState, fromAuthentication.getAuthenticated);
export const getAuthenticationError = createSelector(getAuthenticationState, fromAuthentication.getError);
export const getAuthenticationLoading = createSelector(getAuthenticationState, fromAuthentication.getLoading);
export const getAuthenticatedTeller = createSelector(getAuthenticationState, fromAuthentication.getTeller);

export const getTellerCustomersState = (state: State) => state.tellerCustomers;

export const getTellerCustomerLoadedAt = createSelector(getTellerCustomersState, getResourceLoadedAt);
export const getTellerSelectedCustomer = createSelector(getTellerCustomersState, getResourceSelected);

export const getTellerCustomerDepositProductsState = (state: State) => state.tellerCustomerDepositProducts;
export const getAllTellerCustomerDepositProducts = createSelector(getTellerCustomerDepositProductsState, getResourceAll);
export const hasTellerCustomerDepositProducts = createSelector(getAllTellerCustomerDepositProducts, (products) => {
  return products.length > 0;
});

export const getTellerCustomerLoanProductsState = (state: State) => state.tellerCustomerLoanProducts;
export const getAllTellerCustomerLoanProducts = createSelector(getTellerCustomerLoanProductsState, getResourceAll);
export const hasTellerCustomerLoanProducts = createSelector(getAllTellerCustomerLoanProducts, (products) => {
  return products.length > 0;
});
