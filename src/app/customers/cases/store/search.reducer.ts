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

import * as caseActions from './case.actions';
import {Case} from '../../../../services/portfolio/domain/case.model';
import {SearchCasePayload} from './case.actions';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import {FimsCase} from './model/fims-case.model';

export interface State {
  cases: FimsCase[];
  totalPages: number,
  totalElements: number,
  loading: boolean;
  fetchRequest: FetchRequest;
}

const initialState: State = {
  cases: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export function reducer(state = initialState, action: caseActions.Actions): State {

  switch (action.type) {

    case caseActions.SEARCH: {
      const payload: SearchCasePayload = action.payload;

      return Object.assign({}, state, {
        fetchRequest: payload.fetchRequest,
        loading: true
      });
    }

    case caseActions.SEARCH_COMPLETE: {
      const casePage = action.payload;

      return {
        cases: casePage.elements,
        loading: false,
        fetchRequest: state.fetchRequest,
        totalElements: casePage.totalElements,
        totalPages: casePage.totalPages
      };
    }

    default: {
      return state;
    }
  }
}


export const getCases = (state: State) => state.cases;

export const getFetchRequest = (state: State) => state.fetchRequest;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;
