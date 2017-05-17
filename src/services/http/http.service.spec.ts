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
import {MockBackend, MockConnection} from '@angular/http/testing';
import {AUTHORIZATION_HEADER, HttpClient, TENANT_HEADER, USER_HEADER} from './http.service';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions, RequestOptionsArgs, Headers} from '@angular/http';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ReflectiveInjector} from '@angular/core';

describe('Test http client', () => {

  let tenant: string = 'Reynholm Industries';

  let baseUrl: string = 'baseUrl';

  let authenticationState = {
    username: 'test',
    tenant: tenant,
    authentication: {
      tokenType: 'iDontCare',
      accessToken: 'accessToken',
      accessTokenExpiration: new Date().toISOString(),
      refreshTokenExpiration: new Date().toISOString(),
      passwordExpiration: new Date().toISOString(),
      passwordChangedBy: 'moss'
    }
  };

  let doPostRequest = function (httpClient: HttpClient, options?: RequestOptionsArgs): void {
    httpClient.post('/test', {}, options).subscribe(() => {});
  };

  describe('Test http header', () => {

    beforeEach(() => {
      this.injector = ReflectiveInjector.resolveAndCreate([
        {provide: ConnectionBackend, useClass: MockBackend},
        {provide: RequestOptions, useClass: BaseRequestOptions},
        {
          provide: Store, useClass: class {
            select = jasmine.createSpy('select').and.returnValue(Observable.of(authenticationState))
          }
        },
        Http,
        HttpClient,
      ]);
      this.httpClient = this.injector.get(HttpClient);
      this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    });

    it('should send tenant header', (done: DoneFn) => {
      this.backend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.headers.get(TENANT_HEADER)).toBe(tenant);
        done();
      });
      doPostRequest(this.httpClient);
    });

    it('should send authorization header when logged in', (done: DoneFn) => {
      this.backend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.headers.get(USER_HEADER)).toBe(authenticationState.username);
        expect(connection.request.headers.get(AUTHORIZATION_HEADER)).toBe(authenticationState.authentication.accessToken);
        done();
      });
      doPostRequest(this.httpClient);
    });

    it('should send custom headers', (done: DoneFn) => {
      this.backend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.headers.get("Content-Type")).toBe("multipart/form-data");
        done();
      });
      doPostRequest(this.httpClient, {
        headers: new Headers({
          "Content-Type": "multipart/form-data"
        })
      });
    })

  });

});
