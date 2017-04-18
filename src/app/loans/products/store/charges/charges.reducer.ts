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
import {ResourceState} from '../../../../../components/store/resource.reducer';

export interface State extends ResourceState {
  ids: string[];
  entities: { [id: string]: ChargeDefinition };
  selectedId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: charge.Actions): ResourceState {

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
        selectedId: state.selectedId,
        loadedAt: state.loadedAt
      };
    }

    default: {
      return state;
    }
  }
}
