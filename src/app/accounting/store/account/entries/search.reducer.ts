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

import * as entries from './entries.actions';
import {AccountEntry} from '../../../../../services/accounting/domain/account-entry.model';
import {FetchRequest} from '../../../../../services/domain/paging/fetch-request.model';

export interface State {
  entries: AccountEntry[];
  startDate: string;
  endDate: string;
  totalPages: number,
  totalElements: number,
  loading: boolean;
  fetchRequest: FetchRequest;
}

const initialState: State = {
  entries: [],
  startDate: null,
  endDate: null,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export function reducer(state = initialState, action: entries.Actions): State {

  switch (action.type) {

    case entries.SEARCH: {
      const payload = action.payload;

      return Object.assign({}, state, {
        startDate: payload.startDate,
        endDate: payload.endDate,
        fetchRequest: payload.fetchRequest,
        loading: true
      });
    }

    case entries.SEARCH_COMPLETE: {
      const entryPage = action.payload;

      return {
        entries: entryPage.accountEntries,
        loading: false,
        fetchRequest: state.fetchRequest,
        totalElements: entryPage.totalElements,
        totalPages: entryPage.totalPages,
        startDate: state.startDate,
        endDate: state.endDate
      };
    }

    default: {
      return state;
    }
  }
}


export const getEntries = (state: State) => state.entries;

export const getFetchRequest = (state: State) => state.fetchRequest;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;
