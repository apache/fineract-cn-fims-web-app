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

import {Role} from '../../../services/identity/domain/role.model';
import * as role from './role.actions';
import { createSelector } from 'reselect';

export interface State {
  ids: string[];
  entities: { [id: string]: Role };
  selectedRoleId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedRoleId: null,
};

export function reducer(state = initialState, action: role.Actions): State {
  switch (action.type) {

    case role.LOAD: {
      const role = action.payload;

      if (state.ids.indexOf(role.identifier) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, role.identifier ],
        entities: Object.assign({}, state.entities, {
          [role.identifier]: role
        }),
        selectedRoleId: state.selectedRoleId
      };
    }

    case role.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedRoleId: action.payload
      };
    }

    case role.CREATE_SUCCESS:
    case role.UPDATE_SUCCESS: {
      const role: Role = action.payload;

      return {
        ids: [ ...state.ids, role.identifier ],
        entities: Object.assign({}, state.entities, {
          [role.identifier]: role
        }),
        selectedRoleId: state.selectedRoleId
      }
    }

    case role.DELETE_SUCCESS: {
      const role: Role = action.payload;

      const newIds = state.ids.filter(id => id !== role.identifier);

      const newEntities = newIds.reduce((entities: { [id: string]: Role }, id: string) => {
        let entity = state.entities[id];
        return Object.assign(entities, {
          [entity.identifier]: entity
        });
      }, {});

      return {
        ids: [ ...newIds ],
        entities: newEntities,
        selectedRoleId: state.selectedRoleId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedRoleId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
