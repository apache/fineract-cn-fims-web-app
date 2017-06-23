import {ResourceState} from '../../../../common/store/resource.reducer';
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

import * as caseActions from './case.actions';
import {CaseState} from '../../../../services/portfolio/domain/case-state.model';
import {CaseCommand} from '../../../../services/portfolio/domain/case-command.model';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: caseActions.Actions): ResourceState {

  switch (action.type) {

    case caseActions.EXECUTE_COMMAND_SUCCESS: {
      const payload = action.payload;

      const caseId = payload.caseId;
      const commandAction: string = payload.action;

      const caseInstance = state.entities[caseId];

      let caseState: CaseState = null;

      if(commandAction === 'OPEN') {
        caseState = 'PENDING';
      }else if(commandAction === 'APPROVE') {
        caseState = 'APPROVED';
      }else if(commandAction === 'DENY') {
        caseState = 'CLOSED';
      }else if(commandAction === 'CLOSE') {
        caseState = 'CLOSED';
      }

      caseInstance.currentState = caseState;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [caseInstance.identifier]: caseInstance
        }),
        loadedAt: state.loadedAt,
        selectedId: state.selectedId
      }
    }

    default: {
      return state;
    }
  }
}
