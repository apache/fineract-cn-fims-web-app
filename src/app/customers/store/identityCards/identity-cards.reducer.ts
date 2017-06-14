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

import * as identityCards from './identity-cards.actions';
import {ResourceState} from '../../../../common/store/resource.reducer';
import {IdentificationCard} from '../../../../services/customer/domain/identification-card.model';
import {
  idsToHashWithCurrentTimestamp,
  resourcesToHash
} from '../../../../common/store/reducer.helper';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: identityCards.Actions): ResourceState {

  switch (action.type) {

    case identityCards.LOAD_ALL: {
      return initialState;
    }

    case identityCards.LOAD_ALL_COMPLETE: {
      const identificationCards: IdentificationCard[] = action.payload;

      const ids = identificationCards.map(identificationCard => identificationCard.number);

      const entities = resourcesToHash(identificationCards, 'number');

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
