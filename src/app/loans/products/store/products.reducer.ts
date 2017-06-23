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

import * as product from './product.actions';
import {createSelector} from 'reselect';
import {FimsProduct} from './model/fims-product.model';
import {ResourceState} from '../../../../common/store/resource.reducer';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: product.Actions): ResourceState {
  switch (action.type) {

    case product.ENABLE_SUCCESS: {
      const product = action.payload.product;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [product.identifier]: Object.assign({}, product, {
            enabled: action.payload.enable
          })
        }),
        selectedId: state.selectedId,
        loadedAt: state.loadedAt
      }
    }

    default: {
      return state;
    }
  }
}
