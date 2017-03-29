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

import * as charge from './charge.actions';
import { createSelector } from 'reselect';
import {ChargeDefinition} from '../../../../../services/portfolio/domain/charge-definition.model';

export interface State {
  ids: string[];
  entities: { [id: string]: ChargeDefinition };
  selectedChargeId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedChargeId: null,
};

export function reducer(state = initialState, action: charge.Actions): State {

  switch (action.type) {

    case charge.LOAD_ALL_COMPLETE: {
      const chargeDefinitions = action.payload;
      const newCharges = chargeDefinitions.filter(chargeDefinition => !state.entities[chargeDefinition.identifier]);

      const newChargeIds = newCharges.map(charge => charge.identifier);

      const newChargeEntities = newCharges.reduce((entities: { [id: string]: ChargeDefinition }, chargeDefintion: ChargeDefinition) => {
        return Object.assign(entities, {
          [chargeDefintion.identifier]: chargeDefintion
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newChargeIds ],
        entities: Object.assign({}, state.entities, newChargeEntities),
        selectedChargeId: state.selectedChargeId
      };
    }

    case charge.LOAD: {
      const charge = action.payload;

      if(state.ids.indexOf(charge.identifier) > -1){
        return state;
      }

      return {
        ids: [ ...state.ids, charge.identifier ],
        entities: Object.assign({}, state.entities, {
          [charge.identifier]: charge
        }),
        selectedChargeId: state.selectedChargeId
      };
    }

    case charge.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedChargeId: action.payload
      };
    }

    case charge.CREATE_SUCCESS: {
      const charge = action.payload.charge;

      return {
        ids: [ ...state.ids, charge.identifier ],
        entities: Object.assign({}, state.entities, {
          [charge.identifier]: charge
        }),
        selectedChargeId: state.selectedChargeId
      }
    }

    case charge.DELETE_SUCCESS: {
      const charge: ChargeDefinition = action.payload.charge;

      const newIds = state.ids.filter(id => id !== charge.identifier);

      const newEntities = newIds.reduce((entities: { [id: string]: ChargeDefinition }, id: string) => {
        let entity = state.entities[id];
        return Object.assign(entities, {
          [entity.identifier]: entity
        });
      }, {});

      return {
        ids: [ ...newIds ],
        entities: newEntities,
        selectedChargeId: state.selectedChargeId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedChargeId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
