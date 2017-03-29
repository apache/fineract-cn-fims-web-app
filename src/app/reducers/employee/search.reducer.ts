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

import * as employee from './employee.actions';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Employee} from '../../../services/office/domain/employee.model';


export interface State {
  employees: Employee[];
  totalPages: number,
  totalElements: number,
  loading: boolean;
  fetchRequest: FetchRequest;
}

const initialState: State = {
  employees: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export function reducer(state = initialState, action: employee.Actions): State {

  switch (action.type) {

    case employee.SEARCH: {
      const fetchRequest: FetchRequest = action.payload;

      return Object.assign({}, state, {
        fetchRequest,
        loading: true
      });
    }

    case employee.SEARCH_COMPLETE: {
      const employeePage = action.payload;

      return {
        employees: employeePage.employees,
        loading: false,
        fetchRequest: state.fetchRequest,
        totalElements: employeePage.totalElements,
        totalPages: employeePage.totalPages
      };
    }

    default: {
      return state;
    }
  }
}


export const getEmployees = (state: State) => state.employees;

export const getFetchRequest = (state: State) => state.fetchRequest;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;
