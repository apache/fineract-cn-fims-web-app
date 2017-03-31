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

import {createSelector} from 'reselect';
import {ActionReducer, combineReducers} from '@ngrx/store';


import * as fromOfficeSearch from './office/search.reducer';
import * as fromEmployeeSearch from './employee/search.reducer';
import * as fromRoleSearch from './role/search.reducer';
import * as fromCustomerSearch from './customer/search.reducer';
import * as fromAccountSearch from './account/search.reducer';
import * as fromAuthentication from './security/authentication.reducer';
import * as fromAuthorization from './security/authorization.reducer';
import {compose} from '@ngrx/core/compose';
import {localStorageSync} from 'ngrx-store-localstorage';

export interface State {
  authentication: fromAuthentication.State;
  authorization: fromAuthorization.State;
  officeSearch: fromOfficeSearch.State;
  employeeSearch: fromEmployeeSearch.State;
  roleSearch: fromRoleSearch.State;
  customerSearch: fromCustomerSearch.State;
  accountSearch: fromAccountSearch.State;
}

export const reducers = {
  authentication: fromAuthentication.reducer,
  authorization: fromAuthorization.reducer,
  officeSearch: fromOfficeSearch.reducer,
  employeeSearch: fromEmployeeSearch.reducer,
  roleSearch: fromRoleSearch.reducer,
  customerSearch: fromCustomerSearch.reducer,
  accountSearch: fromAccountSearch.reducer
};

export function createReducer(asyncReducers = {}): ActionReducer<any>{
  return compose(localStorageSync(['authentication', 'authorization'], true), combineReducers)(Object.assign(reducers, asyncReducers));
}

export const productionReducer: ActionReducer<State> = createReducer();

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

/**
 * Office Search Selectors
 */

export const getOfficeSearchState = (state: State) => state.officeSearch;

export const getSearchOffices = createSelector(getOfficeSearchState, fromOfficeSearch.getOffices);
export const getOfficeSearchTotalElements = createSelector(getOfficeSearchState, fromOfficeSearch.getTotalElements);
export const getOfficeSearchTotalPages = createSelector(getOfficeSearchState, fromOfficeSearch.getTotalPages);

export const getOfficeSearchResults = createSelector(getSearchOffices, getOfficeSearchTotalPages, getOfficeSearchTotalElements, (offices, totalPages, totalElements) => {
  return {
    offices: offices,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

/**
 * Employee Search Selectors
 */
export const getEmployeeSearchState = (state: State) => state.employeeSearch;

export const getSearchEmployees = createSelector(getEmployeeSearchState, fromEmployeeSearch.getEmployees);
export const getEmployeeSearchTotalElements = createSelector(getEmployeeSearchState, fromEmployeeSearch.getTotalElements);
export const getEmployeeSearchTotalPages = createSelector(getEmployeeSearchState, fromEmployeeSearch.getTotalPages);

export const getEmployeeSearchResults = createSelector(getSearchEmployees, getEmployeeSearchTotalPages, getEmployeeSearchTotalElements, (employees, totalPages, totalElements) => {
  return {
    employees: employees,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

/**
 * Role Search Selectors
 */
export const getRoleSearchState = (state: State) => state.roleSearch;

export const getSearchRoles = createSelector(getRoleSearchState, fromRoleSearch.getRoles);
export const getRoleSearchTotalElements = createSelector(getRoleSearchState, fromRoleSearch.getTotalElements);
export const getRoleSearchTotalPages = createSelector(getRoleSearchState, fromRoleSearch.getTotalPages);

export const getRoleSearchResults = createSelector(getSearchRoles, getRoleSearchTotalPages, getRoleSearchTotalElements, (roles, totalPages, totalElements) => {
  return {
    roles: roles,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

/**
 * Customer Search Selectors
 */
export const getCustomerSearchState = (state: State) => state.customerSearch;

export const getSearchCustomers = createSelector(getCustomerSearchState, fromCustomerSearch.getCustomers);
export const getCustomerSearchTotalElements = createSelector(getCustomerSearchState, fromCustomerSearch.getTotalElements);
export const getCustomerSearchTotalPages = createSelector(getCustomerSearchState, fromCustomerSearch.getTotalPages);

export const getCustomerSearchResults = createSelector(getSearchCustomers, getCustomerSearchTotalPages, getCustomerSearchTotalElements, (customers, totalPages, totalElements) => {
  return {
    customers: customers,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

/**
 * Account Search Selectors
 */
export const getAccountSearchState = (state: State) => state.accountSearch;

export const getSearchAccounts = createSelector(getAccountSearchState, fromAccountSearch.getAccounts);
export const getAccountSearchTotalElements = createSelector(getAccountSearchState, fromAccountSearch.getTotalElements);
export const getAccountSearchTotalPages = createSelector(getAccountSearchState, fromAccountSearch.getTotalPages);

export const getAccountSearchResults = createSelector(getSearchAccounts, getAccountSearchTotalPages, getAccountSearchTotalElements, (accounts, totalPages, totalElements) => {
  return {
    accounts: accounts,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

export const getAuthenticationState = (state: State) => state.authentication;

export const getAuthentication = createSelector(getAuthenticationState, fromAuthentication.getAuthentication);
export const getAuthenticationError = createSelector(getAuthenticationState, fromAuthentication.getError);
export const getAuthenticationLoading = createSelector(getAuthenticationState, fromAuthentication.getLoading);
export const getUsername = createSelector(getAuthenticationState, fromAuthentication.getUsername);
export const getPasswordError = createSelector(getAuthenticationState, fromAuthentication.getPasswordError);

export const getAuthorizationState = (state: State) => state.authorization;

export const getPermissions = createSelector(getAuthorizationState, fromAuthorization.getPermissions);

export const getPermissionsLoading = createSelector(getAuthorizationState, fromAuthorization.getLoading);
