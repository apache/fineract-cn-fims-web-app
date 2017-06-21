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
import {Injectable} from '@angular/core';
import {Headers, Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/reducers';
import {LOGOUT} from '../../app/reducers/security/security.actions';

export enum Action { QueryStart, QueryStop }

export const TENANT_HEADER: string = 'X-Tenant-Identifier';
export const USER_HEADER: string = 'User';
export const AUTHORIZATION_HEADER: string = 'Authorization';

@Injectable()
export class HttpClient {

  process: Subject<Action> = new Subject<Action>();

  error: Subject<any> = new Subject<any>();

  constructor(private http: Http, private store: Store<fromRoot.State>) {}

  public get(url: string, options?: RequestOptionsArgs, silent?: boolean): Observable<any> {
    return this.createRequest(RequestMethod.Get, url, undefined, options, silent);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs, silent?: boolean): Observable<any> {
    return this.createRequest(RequestMethod.Post, url, body, options, silent);
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.createRequest(RequestMethod.Put, url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.createRequest(RequestMethod.Delete, url, undefined, options);
  }

  private _buildRequestOptions(method: RequestMethod, url: string, body: any, tenant: string, username: string, accessToken: string, options?: RequestOptionsArgs): RequestOptions{
    options = options || {};

    const headers = new Headers();

    if(!(body instanceof FormData)) {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
    }

    headers.set(TENANT_HEADER, tenant);
    headers.set(USER_HEADER, username);
    headers.set(AUTHORIZATION_HEADER, accessToken);

    const requestOptions: RequestOptions = new RequestOptions({
      method: method,
      url: url,
      body: body,
      headers: headers
    });

    return requestOptions.merge(options);
  }

  private createRequest(method: RequestMethod, url: string, body?: any, options?: RequestOptionsArgs, silent?: boolean): Observable<any> {
    return this.store.select(fromRoot.getAuthenticationState)
      .take(1)
      .map(state => this._buildRequestOptions(method, url, body, state.tenant, state.username, state.authentication.accessToken, options))
      .flatMap(requestOptions => {
        this.process.next(Action.QueryStart);

        let request: Observable<any> = this.http.request(new Request(requestOptions))
          .catch((err: any) => {
            const error = err.json();
            if(silent) return Observable.throw(error);

            switch (error.status) {
              case 409:
                return Observable.throw(error);
              case 401:
              case 403:
                this.store.dispatch({ type: LOGOUT });
                return Observable.throw('User is not authenticated');
              default:
                console.debug('Error', error);
                this.error.next(error);
                return Observable.throw(error);
            }
          }).finally(() => this.process.next(Action.QueryStop));

        return request.map((res: Response) => {
          if(res.text()) {
            return res.json()
          }
        });
      });
  }

}
