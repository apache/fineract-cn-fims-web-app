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
import {ResourceState} from '../../../../common/store/resource.reducer';
import {RangeActions} from './range.actions';
import {idsToHashWithCurrentTimestamp, resourcesToHash} from '../../../../common/store/reducer.helper';
import {Actions} from '../../../../common/store/action-creator/action-creator';
import {FimsRange} from '../../../../services/portfolio/domain/range-model';


export interface State extends ResourceState {
  ids: string[];
  entities: { [id: string]: FimsRange };
  selectedId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: Actions<FimsRange>): ResourceState {

  switch (action.type) {

    case RangeActions.LOAD_ALL: {
      return initialState;
    }

    case RangeActions.LOAD_ALL_COMPLETE: {
      const ranges: FimsRange[] = action.payload.resources;

      const ids = ranges.map(chargeDefinition => chargeDefinition.identifier);

      const entities = resourcesToHash(ranges);

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
