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

import * as catalog from "./catalog.actions";
import {createSelector} from "reselect";
import {Catalog} from "../../../../services/catalog/domain/catalog.model";
import {resourcesToHash} from '../../../../common/store/reducer.helper';

export interface State {
  ids: string[];
  entities: { [id: string]: Catalog };
}

export const initialState: State = {
  ids: [],
  entities: {}
};

export function reducer(state = initialState, action: catalog.Actions): State {

  switch (action.type) {

    case catalog.LOAD_ALL: {
      return initialState;
    }

    case catalog.LOAD_ALL_COMPLETE: {
      const catalogs: Catalog[] = action.payload;

      const ids = catalogs.map(catalog => catalog.identifier);

      const entities = resourcesToHash(catalogs);

      return {
        ids: [ ...ids ],
        entities: entities
      };
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
