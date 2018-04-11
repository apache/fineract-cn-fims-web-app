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
import {reducer} from './tellers.reducer';
import {ResourceState} from '../../../common/store/resource.reducer';
import {ExecuteCommandPayload, ExecuteCommandSuccessAction} from './teller.actions';
import {Status} from '../../../services/teller/domain/teller.model';

describe('Tellers Reducer', () => {

  describe('EXECUTE_COMMAND_SUCCESS', () => {

    function createState(state?: Status, assignedEmployee?: string): ResourceState {
      return {
        ids: ['testTeller'],
        entities: {
          'testTeller': {
            code: 'testTeller',
            state,
            assignedEmployee
          }
        },
        selectedId: null,
        loadedAt: {}
      };
    }

    it('should add assigned employee on open', () => {
      const payload: ExecuteCommandPayload = {
        officeId: 'officeId',
        tellerCode: 'testTeller',
        command: {
          action: 'OPEN',
          assignedEmployeeIdentifier: 'test'
        },
        activatedRoute: null
      };

      const initialState: ResourceState = createState();

      const expectedResult: ResourceState = createState('OPEN', payload.command.assignedEmployeeIdentifier);

      const result = reducer(initialState, new ExecuteCommandSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    });

    it('should remove assigned employee on close', () => {
      const payload: ExecuteCommandPayload = {
        officeId: 'officeId',
        tellerCode: 'testTeller',
        command: {
          action: 'CLOSE'
        },
        activatedRoute: null
      };

      const initialState: ResourceState = createState();

      const expectedResult: ResourceState = createState('CLOSED', null);

      const result = reducer(initialState, new ExecuteCommandSuccessAction(payload));

      expect(result).toEqual(expectedResult);
    });
  });

});
