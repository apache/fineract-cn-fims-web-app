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
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Headers, Http, RequestOptionsArgs, Response} from '@angular/http';
import {Error} from '../../domain/error.model';
import {Authentication} from '../../identity/domain/authentication.model';
import {Permission} from '../../identity/domain/permission.model';

@Injectable()
export class AuthenticationService {

  private static encodePassword(password: string): string {
    return btoa(password);
  }

  constructor(@Inject('identityBaseUrl') private identityBaseUrl: string, private http: Http) {
  }

  login(tenantId: string, userId: string, password: string): Observable<Authentication> {
    const encodedPassword: string = AuthenticationService.encodePassword(password);
    const loginUrl = '/token?grant_type=password&username=';
    return this.http.post(this.identityBaseUrl + loginUrl + userId + '&password=' + encodedPassword, {}, this.tenantHeader(tenantId))
      .map((response: Response) => this.mapResponse(response))
      .catch(Error.handleError);
  }

  logout(tenantId: string, userId: string, accessToken: string): Observable<Response> {
    return this.http.delete(this.identityBaseUrl + '/token/_current', this.authorizationHeader(tenantId, userId, accessToken))
      .map((response: Response) => this.mapResponse(response))
      .catch(Error.handleError);
  }

  getUserPermissions(tenantId: string, userId: string, accessToken: string): Observable<Permission[]> {
    return this.http.get(this.identityBaseUrl + '/users/' + userId + '/permissions',
      this.authorizationHeader(tenantId, userId, accessToken)
    )
    .map((response: Response) => this.mapResponse(response))
    .catch(Error.handleError);
  }

  refreshAccessToken(tenantId: string): Observable<Authentication> {
    const refreshTokenUrl = '/token?grant_type=refresh_token';
    return this.http.post(this.identityBaseUrl + refreshTokenUrl, {}, this.tenantHeader(tenantId))
      .map((response: Response): Authentication => this.mapResponse(response))
      .catch(Error.handleError);
  }

  private mapResponse(response: Response): any {
    if (response.text()) {
      return response.json();
    }
  }

  private authorizationHeader(tenantId: string, userId: string, accessToken: string): RequestOptionsArgs {
    const requestOptions: RequestOptionsArgs = this.tenantHeader(tenantId);

    requestOptions.headers.set('User', userId);
    requestOptions.headers.set('Authorization', accessToken);

    return requestOptions;
  }

  private tenantHeader(tenantId: string): RequestOptionsArgs {
    const headers: Headers = new Headers();
    headers.set('X-Tenant-Identifier', tenantId);

    return {
      headers: headers
    };
  }

}
