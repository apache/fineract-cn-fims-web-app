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

import {Action, ActionReducer} from '@ngrx/store';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {createSelector} from 'reselect';

export function emptySearchResult(): SearchResult {
  return {
    elements: [],
    totalElements: 0,
    totalPages: 0
  }
}

export interface SearchPayload {
  fetchRequest: FetchRequest
}

export interface SearchResult {
  elements: any[],
  totalElements: number,
  totalPages: number
}

export interface SearchState {
  entities: any[],
  totalPages: number,
  totalElements: number,
  loading: boolean,
  fetchRequest: FetchRequest
}

const initialState: SearchState = {
  entities: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export const createSearchReducer = (entityName: string, reducer?: ActionReducer<SearchState>) => {
  return function(state: SearchState = initialState, action: Action): SearchState {

    switch (action.type) {

      case `[${entityName}] Search`: {
        const fetchRequest: FetchRequest = action.payload;

        return Object.assign({}, state, {
          fetchRequest,
          loading: true,
          entities: []
        });
      }

      case `[${entityName}] Search Complete`: {
        const searchResult: SearchResult = action.payload;

        return Object.assign({}, state, {
          entities: searchResult.elements,
          totalElements: searchResult.totalElements,
          totalPages: searchResult.totalPages,
          loading: false
        });
      }

      default: {
        // delegate to wrapped reducer
        if(reducer) {
          return reducer(state, action);
        }
        return state;
      }
    }
  }
};

export const getSearchEntities = (state: SearchState) => state.entities;
export const getSearchTotalElements = (state: SearchState) => state.totalElements;
export const getSearchTotalPages = (state: SearchState) => state.totalPages;
export const getSearchLoading = (state: SearchState) => state.loading;

export const getSearchResult = createSelector(getSearchEntities, getSearchTotalElements, getSearchTotalPages, (elements, totalElements, totalPages) => {
  return {
    elements,
    totalElements,
    totalPages
  }
});
