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
import {ResourceState} from '../../../../common/store/resource.reducer';
import * as accounts from './account.actions';
import * as accountTasks from './task/task.actions';
import {AccountCommand} from '../../../../services/accounting/domain/account-command.model';
import {AccountState} from '../../../../services/accounting/domain/account-state.model';
import {Account} from '../../../../services/accounting/domain/account.model';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: accounts.Actions | accountTasks.Actions): ResourceState {

  switch (action.type) {

    case accountTasks.EXECUTE_COMMAND_SUCCESS: {
      let payload = action.payload;

      const accountId = payload.accountId;
      const command: AccountCommand = payload.command;

      let account: Account = state.entities[accountId];

      let accountState: AccountState = null;

      if(command.action === 'LOCK') {
        accountState = 'LOCKED';
      }else if(command.action === 'UNLOCK' || command.action === 'REOPEN') {
        accountState = 'OPEN';
      }else if(command.action === 'CLOSE') {
        accountState = 'CLOSED';
      }

      account.state = accountState;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [account.identifier]: account
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
