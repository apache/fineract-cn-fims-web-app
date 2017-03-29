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

import * as office from './office.actions';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Office} from '../../../services/office/domain/office.model';


export interface State {
  offices: Office[];
  totalPages: number,
  totalElements: number,
  loading: boolean;
  fetchRequest: FetchRequest;
}

const initialState: State = {
  offices: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export function reducer(state = initialState, action: office.Actions): State {

  switch (action.type) {

    case office.SEARCH: {
      const fetchRequest = action.payload;

      return Object.assign({}, state, {
        fetchRequest,
        loading: true
      });
    }

    case office.SEARCH_COMPLETE: {
      const officePage = action.payload;

      return {
        offices: officePage.offices,
        loading: false,
        fetchRequest: state.fetchRequest,
        totalElements: officePage.totalElements,
        totalPages: officePage.totalPages
      };
    }

    default: {
      return state;
    }
  }
}


export const getOffices = (state: State) => state.offices;

export const getFetchRequest = (state: State) => state.fetchRequest;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;
