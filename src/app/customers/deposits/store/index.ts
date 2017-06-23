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

import {
  createResourceReducer, getResourceLoadedAt, getResourceSelected,
  ResourceState
} from '../../../../common/store/resource.reducer';
import * as fromCustomer from '../../store';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../../reducers/index';
import {
  createSearchReducer,
  getSearchEntities,
  getSearchTotalElements,
  getSearchTotalPages,
  SearchState
} from '../../../../common/store/search.reducer';
import {createSelector} from 'reselect';

export interface State extends fromCustomer.State {
  deposits: ResourceState;
  depositSearch: SearchState;
}

const reducers = {
  deposits: createResourceReducer('Deposit', undefined, 'accountIdentifier'),
  depositSearch: createSearchReducer('Deposit')
};

export const depositModuleReducer: ActionReducer<State> = createReducer(reducers);

export class DepositsStore extends Store<State>{}

export function depositsStoreFactory(appStore: Store<fromCustomer.State>){
  appStore.replaceReducer(depositModuleReducer);
  return appStore;
}

export const getDepositSearchState = (state: State) => state.depositSearch;

export const getSearchDeposits = createSelector(getDepositSearchState, getSearchEntities);
export const getDepositSearchTotalElements = createSelector(getDepositSearchState, getSearchTotalElements);
export const getDepositSearchTotalPages = createSelector(getDepositSearchState, getSearchTotalPages);

export const getDepositSearchResults = createSelector(getSearchDeposits, getDepositSearchTotalPages, getDepositSearchTotalElements, (deposits, totalPages, totalElements) => {
  return {
    deposits,
    totalPages,
    totalElements
  };
});

export const getDepositsState = (state: State) => state.deposits;

export const getDepositsLoadedAt = createSelector(getDepositsState, getResourceLoadedAt);
export const getSelectedDepositInstance = createSelector(getDepositsState, getResourceSelected);
