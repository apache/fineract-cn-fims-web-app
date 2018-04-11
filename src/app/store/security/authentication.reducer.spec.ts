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
import {mockAuthentication} from './testing/authentication.mock';
import {reducer} from './authentication.reducer';
import {LoginSuccessAction, LoginSuccessPayload, RefreshAccessTokenSuccessAction} from './security.actions';
import {Authentication} from '../../services/identity/domain/authentication.model';

describe('Authentication Reducer', () => {

  function mockInitialState(authentication: Authentication) {
    return {
      username: 'test',
      tenant: 'test',
      authentication: authentication,
      loading: false,
      error: null,
      passwordError: null
    };
  }

  describe('LOGIN_SUCCESS', () => {
    it('should set authentication, username and tenant', () => {
      const authentication = mockAuthentication();
      const loginPayload: LoginSuccessPayload = {
        username: 'test',
        tenant: 'test',
        authentication: authentication
      };

      const expectedResult = {
        username: 'test',
        tenant: 'test',
        authentication: authentication,
        loading: false,
        error: null,
        passwordError: null
      };

      const result = reducer(undefined, new LoginSuccessAction(loginPayload));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('REFRESH_ACCESS_TOKEN_SUCCESS', () => {
    it('should update authentication', () => {
      const authentication = mockAuthentication();

      const updatedAuthentication = Object.assign({}, authentication, {
        accessToken: 'iamupdated'
      });

      const initialState = mockInitialState(authentication);

      const result = reducer(initialState, new RefreshAccessTokenSuccessAction(updatedAuthentication));

      const expectedResult = Object.assign({}, initialState, {
        authentication: updatedAuthentication
      });

      expect(result).toEqual(expectedResult);
    });
  });

});
