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

import * as tellers from './teller.actions';
import {ResourceState} from '../../../common/store/resource.reducer';
import {idsToHashWithCurrentTimestamp, resourcesToHash} from '../../../common/store/reducer.helper';
import {Case} from '../../../services/portfolio/domain/case.model';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: tellers.Actions): ResourceState {

  switch (action.type) {

    case tellers.LOAD_ALL_LOAN_PRODUCTS: {
      return initialState;
    }

    case tellers.LOAD_ALL_LOAN_PRODUCTS_SUCCESS: {
      const loanProducts: Case[] = action.payload;

      const ids = loanProducts.map(loanProduct => loanProduct.identifier);

      const entities = resourcesToHash(loanProducts);

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
