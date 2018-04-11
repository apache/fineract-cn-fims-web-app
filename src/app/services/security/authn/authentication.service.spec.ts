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
import {AuthenticationService} from './authentication.service';
import {BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {Authentication} from '../../identity/domain/authentication.model';

describe('Test Authentication Service', () => {

  let authService: AuthenticationService;

  const tenant = 'Reynholm Industries';

  const mockAuthentication: Authentication = {
    tokenType: 'iDontCare',
    accessToken: 'accessToken',
    accessTokenExpiration: new Date().toISOString(),
    refreshTokenExpiration: new Date().toISOString(),
    passwordExpiration: new Date().toISOString()
  };

  beforeEach(() => {
    const mockBackend: MockBackend = new MockBackend();

    mockBackend.connections.subscribe((connection: MockConnection) =>
      connection.mockRespond(new Response(new ResponseOptions({body: mockAuthentication})))
    );
    const requestOptions: BaseRequestOptions = new BaseRequestOptions();
    const http: Http = new Http(mockBackend, requestOptions);

    authService = new AuthenticationService('/identity', http);
  });

  it('should login and return authentication', (done: DoneFn) => {
    authService.login(tenant, 'moss', 'test').subscribe((authentication: Authentication) => {
      expect(authentication.tokenType).toBe(mockAuthentication.tokenType);
      expect(authentication.accessToken).toBe(mockAuthentication.accessToken);
      expect(authentication.accessTokenExpiration).toBe(mockAuthentication.accessTokenExpiration);
      expect(authentication.refreshTokenExpiration).toBe(mockAuthentication.refreshTokenExpiration);
      expect(authentication.passwordExpiration).toBe(mockAuthentication.passwordExpiration);

      done();
    });
  });

});
