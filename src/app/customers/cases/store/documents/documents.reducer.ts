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
import * as documentActions from './document.actions';
import {ResourceState} from '../../../../common/store/resource.reducer';
import {CustomerDocument} from '../../../../services/customer/domain/customer-document.model';
import {idsToHashWithCurrentTimestamp, resourcesToHash} from '../../../../common/store/reducer.helper';
import {DeletePagePayload, LockPayload, UploadPagePayload} from './document.actions';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: documentActions.Actions): ResourceState {

  switch (action.type) {

    case documentActions.LOAD_ALL: {
      return initialState;
    }

    case documentActions.LOAD_ALL_COMPLETE: {
      const documents: CustomerDocument[] = action.payload;

      const ids = documents.map(document => document.identifier);

      const entities = resourcesToHash(documents);

      const loadedAt = idsToHashWithCurrentTimestamp(ids);

      return {
        ids: [ ...ids ],
        entities: entities,
        loadedAt: loadedAt,
        selectedId: state.selectedId
      };
    }

    case documentActions.LOCK_SUCCESS: {
      const payload: LockPayload = action.payload;

      const document = state.entities[payload.documentId];

      const entities = Object.assign({}, state.entities, {
        [document.identifier]: Object.assign({}, document, {
          completed: true
        })
      });

      return Object.assign({}, state, {
        entities
      })
    }

    default: {
      return state;
    }
  }
}
