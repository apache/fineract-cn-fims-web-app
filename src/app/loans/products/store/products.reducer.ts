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

export interface State {
  ids: string[];
  entities: { [id: string]: FimsProduct };
  selectedProductId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedProductId: null,
};

export function reducer(state = initialState, action: product.Actions): State {
  switch (action.type) {

    case product.LOAD: {
      const product = action.payload;

      if(state.ids.indexOf(product.identifier) > -1){
        return state;
      }

      return {
        ids: [ ...state.ids, product.identifier ],
        entities: Object.assign({}, state.entities, {
          [product.identifier]: product
        }),
        selectedProductId: state.selectedProductId
      };
    }

    case product.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedProductId: action.payload
      };
    }

    case product.CREATE_SUCCESS:
    case product.UPDATE_SUCCESS: {
      const product = action.payload.product;

      const newIds = state.ids.filter(id => id !== product.identifier);

      return {
        ids: [ ...newIds, product.identifier ],
        entities: Object.assign({}, state.entities, {
          [product.identifier]: product
        }),
        selectedProductId: state.selectedProductId
      }
    }

    case product.ENABLE_SUCCESS: {
      const product = action.payload.product;

      product.enabled = action.payload.enable;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [product.identifier]: product
        }),
        selectedProductId: state.selectedProductId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedProductId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
