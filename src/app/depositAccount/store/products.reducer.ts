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

import * as productActions from '../store/product.actions';
import {ResourceState} from '../../../common/store/resource.reducer';
import {ProductDefinitionCommand} from '../../../services/depositAccount/domain/definition/product-definition-command.model';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: productActions.Actions): ResourceState {

  switch (action.type) {

    case productActions.EXECUTE_COMMAND_SUCCESS: {
      const payload = action.payload;

      const definitionId = payload.definitionId;
      const command: ProductDefinitionCommand = payload.command;

      const definition = state.entities[definitionId];

      let active: boolean = false;

      if(command.action === 'ACTIVATE') {
        active = true;
      }

      definition.active = active;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [definition.identifier]: definition
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
