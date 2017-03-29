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

import * as fromCustomer from '../../store';
import * as fromCaseSearch from './search.reducer';
import * as fromCases from './cases.reducer';
import * as fromCaseForm from './form.reducer';
import * as fromCaseTasks from './tasks/tasks.reducer';
import * as fromCasePayments from './payments/search.reducer';

import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../../reducers/index';
import {createSelector} from 'reselect';

export interface State extends fromCustomer.State{
  cases: fromCases.State;
  caseForm: fromCaseForm.State;
  caseSearch: fromCaseSearch.State;
  caseTasks: fromCaseTasks.State;
  casePayments: fromCasePayments.State;
}

const reducers = {
  cases: fromCases.reducer,
  caseForm: fromCaseForm.reducer,
  caseSearch: fromCaseSearch.reducer,
  caseTasks: fromCaseTasks.reducer,
  casePayments: fromCasePayments.reducer
};

export const caseModuleReducer: ActionReducer<State> = createReducer(reducers);

export class CasesStore extends Store<State>{}

export function caseStoreFactory(appStore: Store<fromCustomer.State>){
  appStore.replaceReducer(caseModuleReducer);
  return appStore;
}

export const getCaseSearchState = (state: State) => state.caseSearch;

export const getSearchCases = createSelector(getCaseSearchState, fromCaseSearch.getCases);
export const getCaseSearchTotalElements = createSelector(getCaseSearchState, fromCaseSearch.getTotalElements);
export const getCaseSearchTotalPages = createSelector(getCaseSearchState, fromCaseSearch.getTotalPages);

export const getCaseSearchResults = createSelector(getSearchCases, getCaseSearchTotalPages, getCaseSearchTotalElements, (cases, totalPages, totalElements) => {
  return {
    cases: cases,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

export const getCasesState = (state: State) => state.cases;

export const getCaseFormState = (state: State) => state.caseForm;

export const getCaseEntities = createSelector(getCasesState, fromCases.getEntities);
export const getCaseIds = createSelector(getCasesState, fromCases.getIds);
export const getSelectedCaseId = createSelector(getCasesState, fromCases.getSelectedId);
export const getSelectedCase = createSelector(getCasesState, fromCases.getSelected);

export const getCaseTasksState = (state: State) => state.caseTasks;

export const getCaseTasksEntities = createSelector(getCaseTasksState, fromCaseTasks.getEntities);


export const getCasePaymentsSearchState = (state: State) => state.casePayments;

export const getSearchCasePayments = createSelector(getCasePaymentsSearchState, fromCasePayments.getPayments);
export const getCasePaymentsSearchTotalElements = createSelector(getCasePaymentsSearchState, fromCasePayments.getTotalElements);
export const getCasePaymentsSearchTotalPages = createSelector(getCasePaymentsSearchState, fromCasePayments.getTotalPages);

export const getCasePaymentSearchResults = createSelector(getSearchCasePayments, getCasePaymentsSearchTotalElements, getCasePaymentsSearchTotalPages, (payments, totalPages, totalElements) => {
  return {
    payments: payments,
    totalPages: totalPages,
    totalElements: totalElements
  };
});
