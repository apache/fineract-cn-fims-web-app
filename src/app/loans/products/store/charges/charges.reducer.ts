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
import {ResourceState} from '../../../../../common/store/resource.reducer';
import {idsToHashWithCurrentTimestamp, resourcesToHash} from '../../../../../common/store/reducer.helper';

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

    case charge.LOAD_ALL: {
      return initialState
    }

    case charge.LOAD_ALL_COMPLETE: {
      const chargeDefinitions: ChargeDefinition[] = action.payload;

      const ids = chargeDefinitions.map(chargeDefinition => chargeDefinition.identifier);

      const entities = resourcesToHash(chargeDefinitions);

      const loadedAt = idsToHashWithCurrentTimestamp(ids);

      return {
        ids: [ ...ids ],
        entities: entities,
        loadedAt: loadedAt,
        selectedId: state.selectedId
      };
    }

    default: {
      return state;
    }
  }
}
