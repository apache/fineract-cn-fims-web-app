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
import { createSelector } from 'reselect';
import {Case} from '../../../../services/portfolio/domain/case.model';

export interface State {
  ids: string[];
  entities: { [id: string]: Case };
  selectedCaseId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedCaseId: null,
};

export function reducer(state = initialState, action: caseActions.Actions): State {

  switch (action.type) {

    case caseActions.SEARCH_COMPLETE: {
      const caseDefinitions = action.payload.elements;
      const newCases = caseDefinitions.filter(caseDefinition => !state.entities[caseDefinition.identifier]);

      const newCaseIds = newCases.map(caseEntity => caseEntity.identifier);

      const newCaseEntities = newCases.reduce((entities: { [id: string]: Case }, caseEntity: Case) => {
        return Object.assign(entities, {
          [caseEntity.identifier]: caseEntity
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newCaseIds ],
        entities: Object.assign({}, state.entities, newCaseEntities),
        selectedCaseId: state.selectedCaseId
      };
    }

    case caseActions.LOAD: {
      const caseEntity = action.payload;

      if(state.ids.indexOf(caseEntity.identifier) > -1){
        return state;
      }

      return {
        ids: [ ...state.ids, caseEntity.identifier ],
        entities: Object.assign({}, state.entities, {
          [caseEntity.identifier]: caseEntity
        }),
        selectedCaseId: state.selectedCaseId
      };
    }

    case caseActions.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedCaseId: action.payload
      };
    }

    case caseActions.CREATE_SUCCESS:
    case caseActions.UPDATE_SUCCESS: {
      const caseEntity = action.payload.case;

      return {
        ids: [ ...state.ids, caseEntity.identifier ],
        entities: Object.assign({}, state.entities, {
          [caseEntity.identifier]: caseEntity
        }),
        selectedCaseId: state.selectedCaseId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedCaseId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
