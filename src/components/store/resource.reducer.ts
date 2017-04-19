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

import {Action, ActionReducer} from '@ngrx/store';
import {createSelector} from 'reselect';
import {RoutePayload} from './route-payload';

export interface LoadResourcePayload {
  resource: any
}

export interface SelectResourcePayload {
  selectedId: string;
}

export interface CreateResourceSuccessPayload extends RoutePayload {
  resource: any
}

export interface UpdateResourceSuccessPayload extends RoutePayload {
  resource: any
}

export interface DeleteResourceSuccessPayload extends RoutePayload {
  resource: any
}

export interface ResourceState {
  ids: string[];
  entities: { [id: string]: any };
  selectedId: string | null;
  loadedAt: { [id: string]: number }
}

const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null
};

export const createResourceReducer = (resource: string, reducer?: ActionReducer<ResourceState>) => {
  return function(state: ResourceState = initialState, action: Action): ResourceState {

    switch (action.type) {

      case `[${resource}] Load`: {
        const resource = action.payload.resource;

        const newIds = state.ids.filter(id => id !== resource.identifier);

        return {
          ids: [ ...newIds, resource.identifier ],
          entities: Object.assign({}, state.entities, {
            [resource.identifier]: resource
          }),
          selectedId: state.selectedId,
          loadedAt: Object.assign({}, state.entities, {
            [resource.identifier]: Date.now()
          })
        };
      }

      case `[${resource}] Select`: {
        return {
          ids: state.ids,
          entities: state.entities,
          selectedId: action.payload,
          loadedAt: state.loadedAt
        };
      }

      case `[${resource}] Create Success`:
      case `[${resource}] Update Success`: {
        const resource = action.payload.resource;

        return {
          ids: [ ...state.ids, resource.identifier ],
          entities: Object.assign({}, state.entities, {
            [resource.identifier]: resource
          }),
          selectedId: state.selectedId,
          loadedAt: state.loadedAt
        }
      }

      case `[${resource}] Delete Success`: {
        const resource = action.payload.resource;

        const newIds = state.ids.filter(id => id !== resource.identifier);

        const newEntities = newIds.reduce((entities: { [id: string]: any }, id: string) => {
          let entity = state.entities[id];
          return Object.assign(entities, {
            [entity.identifier]: entity
          });
        }, {});

        const newLoadedAt = newIds.reduce((entities: { [id: string]: any }, id: string) => {
          let loadedAt = state.loadedAt[id];
          return Object.assign(entities, {
            [id]: loadedAt
          });
        }, {});

        return {
          ids: [ ...newIds ],
          entities: newEntities,
          loadedAt: newLoadedAt,
          selectedId: state.selectedId,
        }
      }

      default: {
        // delegate to wrapped reducer
        if(reducer) {
          return reducer(state, action);
        }
        return state;
      }
    }
  }
};

export const getResourceEntities = (cacheState: ResourceState) => cacheState.entities;
export const getResourceLoadedAt = (cacheState: ResourceState) => cacheState.loadedAt;
export const getResourceIds = (cacheState: ResourceState) => cacheState.ids;
export const getResourceSelectedId = (cacheState: ResourceState) => cacheState.selectedId;

export const getResourceSelected = createSelector(getResourceEntities, getResourceSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getResourceAll = createSelector(getResourceEntities, getResourceIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
