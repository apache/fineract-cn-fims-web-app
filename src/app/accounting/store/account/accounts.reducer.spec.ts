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

import {reducer} from './accounts.reducer';
import {ResourceState} from '../../../../common/store/resource.reducer';
import {ExecuteCommandPayload, ExecuteCommandSuccessAction} from './task/task.actions';
import {AccountCommandAction} from '../../../../services/accounting/domain/account-command-action.model';
import {AccountState} from '../../../../services/accounting/domain/account-state.model';

describe('Accounts Reducer', () => {

  function mockSuccessAction(action: AccountCommandAction): ExecuteCommandPayload {
    return {
      accountId: 'test',
      command: {
        action: action,
        comment: 'test'
      },
      activatedRoute: null
    }
  }

  function mockState(state: AccountState): ResourceState {
    return {
      ids: ['test'],
      entities: {
        'test': {
          identifier: 'test',
          name: 'test',
          state: state
        }
      },
      selectedId: null,
      loadedAt: null
    }
  }

  it('should open the account when reopened', () => {
    const result = reducer(mockState('CLOSED'), new ExecuteCommandSuccessAction(mockSuccessAction('REOPEN')));

    expect(result).toEqual(mockState('OPEN'));
  });

  it('should open the account when unlocked', () => {
    const result = reducer(mockState('LOCKED'), new ExecuteCommandSuccessAction(mockSuccessAction('UNLOCK')));

    expect(result).toEqual(mockState('OPEN'));
  });

  it('should lock the account when locked', () => {
    const result = reducer(mockState('OPEN'), new ExecuteCommandSuccessAction(mockSuccessAction('LOCK')));

    expect(result).toEqual(mockState('LOCKED'));
  });

  it('should close the account when closed', () => {
    const result = reducer(mockState('OPEN'), new ExecuteCommandSuccessAction(mockSuccessAction('CLOSE')));

    expect(result).toEqual(mockState('CLOSED'));
  });

});
