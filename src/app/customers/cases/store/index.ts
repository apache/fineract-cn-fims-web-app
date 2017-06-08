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
import * as fromCases from './cases.reducer';
import * as fromCaseForm from './form.reducer';
import * as fromCaseTasks from './tasks/tasks.reducer';
import * as fromCasePayments from './payments/search.reducer';

import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../../reducers/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
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
import {createFormReducer, getFormError} from '../../../../common/store/form.reducer';

export interface State extends fromCustomer.State{
  cases: ResourceState;
  caseForm: fromCaseForm.State;
  caseSearch: SearchState;
  caseTasks: fromCaseTasks.State;
  casePayments: fromCasePayments.State;
}

const reducers = {
  cases: createResourceReducer('Case', fromCases.reducer),
  caseForm: createFormReducer('Case', fromCaseForm.reducer),
  caseSearch: createSearchReducer('Case'),
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

export const getSearchCases = createSelector(getCaseSearchState, getSearchEntities);
export const getCaseSearchTotalElements = createSelector(getCaseSearchState, getSearchTotalElements);
export const getCaseSearchTotalPages = createSelector(getCaseSearchState, getSearchTotalPages);

export const getCaseSearchResults = createSelector(getSearchCases, getCaseSearchTotalPages, getCaseSearchTotalElements, (cases, totalPages, totalElements) => {
  return {
    cases: cases,
    totalPages: totalPages,
    totalElements: totalElements
  };
});

export const getCasesState = (state: State) => state.cases;

export const getCaseEntities = createSelector(getCasesState, getResourceEntities);
export const getCasesLoadedAt = createSelector(getCasesState, getResourceLoadedAt);
export const getCaseIds = createSelector(getCasesState, getResourceIds);
export const getSelectedCaseId = createSelector(getCasesState, getResourceSelectedId);
export const getSelectedCase = createSelector(getCasesState, getResourceSelected);

export const getCaseTasksState = (state: State) => state.caseTasks;

export const getCaseTasksEntities = createSelector(getCaseTasksState, fromCaseTasks.getEntities);


export const getCasePaymentsSearchState = (state: State) => state.casePayments;

export const getSearchCasePaymentPage = createSelector(getCasePaymentsSearchState, fromCasePayments.getPaymentPage);

export const getCaseFormState = (state: State) => state.caseForm;
export const getCaseFormError = createSelector(getCaseFormState, getFormError);

export const getCaseFormProduct = createSelector(getCaseFormState, fromCaseForm.getFormProduct);
