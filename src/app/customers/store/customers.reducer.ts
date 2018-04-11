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
import * as customer from './customer.actions';
import * as customerTasks from './customerTasks/customer-task.actions';
import {Command} from '../../services/customer/domain/command.model';
import {CustomerState} from '../../services/customer/domain/customer-state.model';
import {ResourceState} from '../../common/store/resource.reducer';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: customer.Actions | customerTasks.Actions): ResourceState {

  switch (action.type) {

    case customerTasks.EXECUTE_COMMAND_SUCCESS: {
      const payload = action.payload;

      const customerId = payload.customerId;
      const command: Command = payload.command;

      const customer = state.entities[customerId];

      let customerState: CustomerState = null;

      if (command.action === 'ACTIVATE') {
        customerState = 'ACTIVE';
      }else if (command.action === 'LOCK') {
        customerState = 'LOCKED';
      }else if (command.action === 'UNLOCK') {
        customerState = 'ACTIVE';
      }else if (command.action === 'CLOSE') {
        customerState = 'CLOSED';
      }else if (command.action === 'REOPEN') {
        customerState = 'ACTIVE';
      }

      customer.currentState = customerState;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [customer.identifier]: customer
        }),
        loadedAt: state.loadedAt,
        selectedId: state.selectedId
      };
    }

    default: {
      return state;
    }
  }
}
