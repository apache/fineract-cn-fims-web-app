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

import {Office} from '../../../services/office/domain/office.model';
import * as office from './office.actions';
import { createSelector } from 'reselect';

export interface State {
  ids: string[];
  entities: { [id: string]: Office };
  selectedOfficeId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedOfficeId: null,
};

export function reducer(state = initialState, action: office.Actions): State {
  switch (action.type) {

    case office.LOAD: {
      const office: Office = action.payload;

      if (state.ids.indexOf(office.identifier) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, office.identifier ],
        entities: Object.assign({}, state.entities, {
          [office.identifier]: office
        }),
        selectedOfficeId: state.selectedOfficeId
      };
    }

    case office.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedOfficeId: action.payload
      };
    }

    case office.CREATE_SUCCESS:
    case office.UPDATE_SUCCESS: {
      const office: Office = action.payload.office;

      return {
        ids: [ ...state.ids, office.identifier ],
        entities: Object.assign({}, state.entities, {
          [office.identifier]: office
        }),
        selectedOfficeId: state.selectedOfficeId
      }
    }

    case office.DELETE_SUCCESS: {
      const office: Office = action.payload.office;

      const newIds = state.ids.filter(id => id !== office.identifier);

      const newEntities = newIds.reduce((entities: { [id: string]: Office }, id: string) => {
        let entity = state.entities[id];
        return Object.assign(entities, {
          [entity.identifier]: entity
        });
      }, {});

      return {
        ids: [ ...newIds ],
        entities: newEntities,
        selectedOfficeId: state.selectedOfficeId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedOfficeId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
