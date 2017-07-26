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

import * as fromAuthentication from './security/authentication.reducer';
import * as fromAuthorization from './security/authorization.reducer';
import * as fromAccounts from './account/accounts.reducer';
import {compose} from '@ngrx/core/compose';
import {localStorageSync} from 'ngrx-store-localstorage';
import {
  createSearchReducer, getSearchEntities, getSearchLoading, getSearchTotalElements, getSearchTotalPages,
  SearchState
} from '../../common/store/search.reducer';

export interface State {
  authentication: fromAuthentication.State;
  authorization: fromAuthorization.State;
  officeSearch: SearchState;
  countrySearch: SearchState;
  employeeSearch: SearchState;
  roleSearch: SearchState;
  customerSearch: SearchState;
  accountSearch: SearchState;
  ledgerSearch: SearchState;
}

export const reducers = {
  authentication: fromAuthentication.reducer,
  authorization: fromAuthorization.reducer,

  officeSearch: createSearchReducer('Office'),
  countrySearch: createSearchReducer('Country'),
  employeeSearch: createSearchReducer('Employee'),
  roleSearch: createSearchReducer('Role'),
  customerSearch: createSearchReducer('Customer'),
  accountSearch: createSearchReducer('Account', fromAccounts.reducer),
  ledgerSearch: createSearchReducer('Ledger'),
};

export function createReducer(asyncReducers = {}): ActionReducer<any>{
  return compose(localStorageSync({
    keys: [],
    rehydrate: true
  }), combineReducers)(Object.assign(reducers, asyncReducers));
}

export const productionReducer: ActionReducer<State> = createReducer();

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

/**
 * Office Search Selectors
 */

export const getOfficeSearchState = (state: State) => state.officeSearch;

export const getSearchOffices = createSelector(getOfficeSearchState, getSearchEntities);
export const getOfficeSearchTotalElements = createSelector(getOfficeSearchState, getSearchTotalElements);
export const getOfficeSearchTotalPages = createSelector(getOfficeSearchState, getSearchTotalPages);
export const getOfficeSearchLoading = createSelector(getOfficeSearchState, getSearchLoading);

export const getOfficeSearchResults = createSelector(getSearchOffices, getOfficeSearchTotalPages, getOfficeSearchTotalElements, (offices, totalPages, totalElements) => {
  return {
    offices: offices,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

/**
 * Country Search Selectors
 */

export const getCountrySearchState = (state: State) => state.countrySearch;

export const getSearchCountry = createSelector(getCountrySearchState, getSearchEntities);

/**
 * Employee Search Selectors
 */
export const getEmployeeSearchState = (state: State) => state.employeeSearch;

export const getSearchEmployees = createSelector(getEmployeeSearchState, getSearchEntities);
export const getEmployeeSearchTotalElements = createSelector(getEmployeeSearchState, getSearchTotalElements);
export const getEmployeeSearchTotalPages = createSelector(getEmployeeSearchState, getSearchTotalPages);
export const getEmployeeSearchLoading = createSelector(getEmployeeSearchState, getSearchLoading);

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

export const getSearchRoles = createSelector(getRoleSearchState, getSearchEntities);
export const getRoleSearchTotalElements = createSelector(getRoleSearchState, getSearchTotalElements);
export const getRoleSearchTotalPages = createSelector(getRoleSearchState, getSearchTotalPages);
export const getRoleSearchLoading = createSelector(getRoleSearchState, getSearchLoading);

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

export const getSearchCustomers = createSelector(getCustomerSearchState, getSearchEntities);
export const getCustomerSearchTotalElements = createSelector(getCustomerSearchState, getSearchTotalElements);
export const getCustomerSearchTotalPages = createSelector(getCustomerSearchState, getSearchTotalPages);
export const getCustomerSearchLoading = createSelector(getCustomerSearchState, getSearchLoading);

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

export const getSearchAccounts = createSelector(getAccountSearchState, getSearchEntities);
export const getAccountSearchTotalElements = createSelector(getAccountSearchState, getSearchTotalElements);
export const getAccountSearchTotalPages = createSelector(getAccountSearchState, getSearchTotalPages);
export const getAccountSearchLoading = createSelector(getAccountSearchState, getSearchLoading);

export const getAccountSearchResults = createSelector(getSearchAccounts, getAccountSearchTotalPages, getAccountSearchTotalElements, (accounts, totalPages, totalElements) => {
  return {
    accounts: accounts,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

/**
 * Ledger Search Selectors
 */
export const getLedgerSearchState = (state: State) => state.ledgerSearch;

export const getSearchLedgers = createSelector(getLedgerSearchState, getSearchEntities);
export const getLedgerSearchTotalElements = createSelector(getLedgerSearchState, getSearchTotalElements);
export const getLedgerSearchTotalPages = createSelector(getLedgerSearchState, getSearchTotalPages);

export const getLedgerSearchResults = createSelector(getSearchLedgers, getLedgerSearchTotalElements, getLedgerSearchTotalPages, (ledgers, totalPages, totalElements) => {
  return {
    ledgers: ledgers,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

export const getAuthenticationState = (state: State) => state.authentication;

export const getAuthentication = createSelector(getAuthenticationState, fromAuthentication.getAuthentication);
export const getAuthenticationError = createSelector(getAuthenticationState, fromAuthentication.getError);
export const getAuthenticationLoading = createSelector(getAuthenticationState, fromAuthentication.getLoading);
export const getUsername = createSelector(getAuthenticationState, fromAuthentication.getUsername);
export const getTenant = createSelector(getAuthenticationState, fromAuthentication.getTenant);
export const getPasswordError = createSelector(getAuthenticationState, fromAuthentication.getPasswordError);

export const getAuthorizationState = (state: State) => state.authorization;

export const getPermissions = createSelector(getAuthorizationState, fromAuthorization.getPermissions);

export const getPermissionsLoading = createSelector(getAuthorizationState, fromAuthorization.getLoading);
