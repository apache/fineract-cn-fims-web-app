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

import {Customer} from '../../../services/customer/domain/customer.model';
import * as customer from './customer.actions';
import * as customerTasks from './tasks/task.actions';
import { createSelector } from 'reselect';
import {Command} from '../../../services/customer/domain/command.model';
import {CustomerState} from '../../../services/customer/domain/customer-state.model';

export interface State {
  ids: string[];
  entities: { [id: string]: Customer };
  selectedCustomerId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedCustomerId: null,
};

export function reducer(state = initialState, action: customer.Actions | customerTasks.Actions): State {

  switch (action.type) {

    case customer.LOAD: {
      const customer = action.payload;

      if (state.ids.indexOf(customer.identifier) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, customer.identifier ],
        entities: Object.assign({}, state.entities, {
          [customer.identifier]: customer
        }),
        selectedCustomerId: state.selectedCustomerId
      };
    }

    case customer.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedCustomerId: action.payload
      };
    }

    case customer.CREATE_SUCCESS:
    case customer.UPDATE_SUCCESS: {
      const customer = action.payload.customer;

      return {
        ids: [ ...state.ids, customer.identifier ],
        entities: Object.assign({}, state.entities, {
          [customer.identifier]: customer
        }),
        selectedCustomerId: state.selectedCustomerId
      }
    }

    case customerTasks.EXECUTE_COMMAND_SUCCESS: {
      let payload = action.payload;

      let customerId = payload.customerId;
      let command: Command = payload.command;

      let customer = state.entities[customerId];

      let customerState: CustomerState = null;

      // TODO add mapping
      if(command.action === 'ACTIVATE'){
        customerState = 'ACTIVE';
      }else if(command.action === 'LOCK'){
        customerState = 'LOCKED';
      }else if(command.action === 'UNLOCK'){
        customerState = 'ACTIVE';
      }else if(command.action === 'CLOSE'){
        customerState = 'CLOSED';
      }else if(command.action === 'REOPEN'){
        customerState = 'ACTIVE';
      }

      customer.currentState = customerState;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [customer.identifier]: customer
        }),
        selectedCustomerId: state.selectedCustomerId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedCustomerId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
