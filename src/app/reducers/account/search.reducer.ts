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

import * as account from './account.actions';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Account} from '../../../services/accounting/domain/account.model';


export interface State {
  accounts: Account[];
  totalPages: number,
  totalElements: number,
  loading: boolean;
  fetchRequest: FetchRequest;
}

const initialState: State = {
  accounts: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export function reducer(state = initialState, action: account.Actions): State {

  switch (action.type) {

    case account.SEARCH: {
      const fetchRequest: FetchRequest = action.payload;

      return Object.assign({}, state, {
        fetchRequest,
        loading: true
      });
    }

    case account.SEARCH_COMPLETE: {
      const accountPage = action.payload;

      return {
        accounts: accountPage.accounts,
        loading: false,
        fetchRequest: state.fetchRequest,
        totalElements: accountPage.totalElements,
        totalPages: accountPage.totalPages
      };
    }

    default: {
      return state;
    }
  }
}


export const getAccounts = (state: State) => state.accounts;

export const getFetchRequest = (state: State) => state.fetchRequest;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;
