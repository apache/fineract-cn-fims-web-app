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
import * as groupDefinition from './definition.actions';
import {GroupDefinition} from '../../../services/group/domain/group-definition.model';
import {ResourceState} from '../../../common/store/resource.reducer';
import {idsToHashWithCurrentTimestamp, resourcesToHash} from '../../../common/store/reducer.helper';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: groupDefinition.Actions): ResourceState {

  switch (action.type) {

    case groupDefinition.LOAD_ALL: {
      return initialState;
    }

    case groupDefinition.LOAD_ALL_COMPLETE: {
      const groupDefinitions1: GroupDefinition[] = action.payload;

      const ids = groupDefinitions1.map(groupDefinition => groupDefinition.identifier);

      const entities = resourcesToHash(groupDefinitions1);

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
