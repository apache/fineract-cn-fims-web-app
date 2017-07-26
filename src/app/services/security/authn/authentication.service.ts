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

import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, RequestOptionsArgs, Headers, Response} from '@angular/http';
import {Error} from '../../domain/error.model';
import {Authentication} from '../../identity/domain/authentication.model';
import {Permission} from '../../identity/domain/permission.model';

@Injectable()
export class AuthenticationService {

  constructor(@Inject('identityBaseUrl') private identityBaseUrl: string, private http: Http) {}

  private static encodePassword(password: string): string{
    return btoa(password);
  }

  login(tenantId: string, userId: string, password: string): Observable<Authentication> {
    let encodedPassword: string = AuthenticationService.encodePassword(password);
    let loginUrl: string = '/token?grant_type=password&username=';
    return this.http.post(this.identityBaseUrl + loginUrl + userId + '&password=' + encodedPassword, {}, this.tenantHeader(tenantId))
      .map((response: Response) => this.mapResponse(response))
      .catch(Error.handleError);
  }

  logout(tenantId: string, userId: string, accessToken: string): Observable<Response> {
    return this.http.delete(this.identityBaseUrl + '/token/_current', this.authorizationHeader(tenantId, userId, accessToken))
      .map((response: Response) => this.mapResponse(response))
      .catch(Error.handleError);
  }

  getUserPermissions(tenantId: string, userId: string, accessToken: string): Observable<Permission[]>{
    return this.http.get(this.identityBaseUrl + '/users/' + userId + '/permissions', this.authorizationHeader(tenantId, userId, accessToken))
      .map((response: Response) => this.mapResponse(response))
      .catch(Error.handleError)
  }

  refreshAccessToken(tenantId: string): Observable<Authentication> {
    let refreshTokenUrl = '/token?grant_type=refresh_token';
    return this.http.post(this.identityBaseUrl + refreshTokenUrl, {}, this.tenantHeader(tenantId))
      .map((response: Response): Authentication => this.mapResponse(response))
      .catch(Error.handleError);
  }

  private mapResponse(response: Response): any{
    if(response.text()){
      return response.json();
    }
  }

  private authorizationHeader(tenantId: string, userId: string, accessToken: string): RequestOptionsArgs{
    let requestOptions: RequestOptionsArgs = this.tenantHeader(tenantId);

    requestOptions.headers.set('User', userId);
    requestOptions.headers.set('Authorization', accessToken);

    return requestOptions;
  }

  private tenantHeader(tenantId: string): RequestOptionsArgs{
    let headers: Headers = new Headers();
    headers.set('X-Tenant-Identifier', tenantId);

    return {
      headers: headers
    };
  }

}
