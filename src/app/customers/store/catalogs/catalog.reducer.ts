/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as catalogActions from './catalog.actions';
import {Catalog} from '../../../services/catalog/domain/catalog.model';
import {Field} from '../../../services/catalog/domain/field.model';
import {createSelector} from 'reselect';

export interface State {
  catalog: Catalog;
  loadedAt: number;
  selectedFieldIdentifier: string;
}

const initialState: State = {
  catalog: null,
  loadedAt: null,
  selectedFieldIdentifier: null
};

export function reducer(state: State = initialState, action: catalogActions.Actions): State {

  switch (action.type) {

    case catalogActions.LOAD: {
      const catalog: Catalog = action.payload;

      return Object.assign({}, state, {
        catalog,
        loadedAt: Date.now()
      });
    }

    case catalogActions.CREATE_SUCCESS: {
      const catalog: Catalog = action.payload.catalog;

      return Object.assign({}, state, {
        catalog,
        loadedAt: state.loadedAt
      });
    }

    case catalogActions.DELETE_SUCCESS: {
      return initialState;
    }

    case catalogActions.SELECT_FIELD: {
      return Object.assign({}, state, {
        selectedFieldIdentifier: action.payload
      });
    }

    case catalogActions.UPDATE_FIELD_SUCCESS: {
      const payload = action.payload;
      const updatedField: Field = payload.field;

      const catalog = Object.assign({}, state.catalog, {
        fields: state.catalog.fields.map(field =>
          field.identifier === updatedField.identifier ? updatedField : field
        )
      });

      return Object.assign({}, state, {
        catalog,
        loadedAt: state.loadedAt
      });
    }

    case catalogActions.DELETE_FIELD_SUCCESS: {
      const payload = action.payload;
      const deletedField: Field = payload.field;

      const catalog = Object.assign({}, state.catalog, {
        fields: state.catalog.fields.filter(field =>
          field.identifier !== deletedField.identifier
        )
      });

      return Object.assign({}, state, {
        catalog,
        loadedAt: state.loadedAt
      });
    }

    default: {
      return state;
    }
  }
}

export const getCustomerCatalog = (state: State) => state.catalog;
export const getCustomerCatalogLoadedAt = (state: State) => state.loadedAt;
export const getSelectedFieldId = (state: State) => state.selectedFieldIdentifier;
export const getSelectedField = createSelector(getCustomerCatalog, getSelectedFieldId, (catalog, selectedId) => {
  return catalog.fields.find(field => field.identifier === selectedId);
});
