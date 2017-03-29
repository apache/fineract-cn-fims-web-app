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

import {Employee} from '../../../services/office/domain/employee.model';
import * as employee from './employee.actions';
import { createSelector } from 'reselect';

export interface State {
  ids: string[];
  entities: { [id: string]: Employee };
  selectedEmployeeId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedEmployeeId: null,
};

export function reducer(state = initialState, action: employee.Actions): State {
  switch (action.type) {

    case employee.LOAD: {
      const employee = action.payload;

      if (state.ids.indexOf(employee.identifier) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, employee.identifier ],
        entities: Object.assign({}, state.entities, {
          [employee.identifier]: employee
        }),
        selectedEmployeeId: state.selectedEmployeeId
      };
    }

    case employee.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedEmployeeId: action.payload
      };
    }

    case employee.CREATE_SUCCESS:
    case employee.UPDATE_SUCCESS: {
      const employee = action.payload.employee;

      const newIds = state.ids.filter(id => id !== employee.identifier);

      return {
        ids: [ ...newIds, employee.identifier ],
        entities: Object.assign({}, state.entities, {
          [employee.identifier]: employee
        }),
        selectedEmployeeId: state.selectedEmployeeId
      }
    }

    case employee.DELETE_SUCCESS: {
      const employee: Employee = action.payload.employee;

      const newIds = state.ids.filter(id => id !== employee.identifier);

      const newEntities = newIds.reduce((entities: { [id: string]: Employee }, id: string) => {
        let entity = state.entities[id];
        return Object.assign(entities, {
          [entity.identifier]: entity
        });
      }, {});

      return {
        ids: [ ...newIds ],
        entities: newEntities,
        selectedEmployeeId: state.selectedEmployeeId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedEmployeeId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
