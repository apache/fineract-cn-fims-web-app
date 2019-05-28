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
import {Injectable} from '@angular/core';
import {Headers, Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../store';
import {LOGOUT} from '../../store/security/security.actions';

export enum Action { QueryStart, QueryStop }

export const TENANT_HEADER = 'X-Tenant-Identifier';
export const USER_HEADER = 'User';
export const AUTHORIZATION_HEADER = 'Authorization';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import {mergeMap, map, take, finalize, catchError} from 'rxjs/operators';

@Injectable()
export class HttpClient {

  process: Subject<Action> = new Subject<Action>();

  error: Subject<any> = new Subject<any>();

  constructor(private http: Http, private store: Store<fromRoot.State>) {
  }

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

  private _buildRequestOptions(method: RequestMethod, url: string, body: any, tenant: string, username: string,
                               accessToken: string, options?: RequestOptionsArgs): RequestOptions {
    options = options || {};

    const headers = new Headers();

    if (!(body instanceof FormData)) {
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
    return this.store.select(fromRoot.getAuthenticationState).pipe(
      take(1),
      map(state => this._buildRequestOptions(method, url, body, state.tenant, state.username, state.authentication.accessToken, options)),
      mergeMap(requestOptions => {
        this.process.next(Action.QueryStart);

        const request: Observable<any> = this.http.request(new Request(requestOptions)).pipe(
          catchError((err: any) => {
            const error = err.json();
            if (silent) {
              return observableThrowError(error);
            }

            switch (error.status) {
              case 409:
                return observableThrowError(error);
              case 401:
              case 403:
                this.store.dispatch({type: LOGOUT});
                return observableThrowError('User is not authenticated');
              default:
                console.error('Error', error);
                this.error.next(error);
                return observableThrowError(error);
            }
          }),finalize(() => this.process.next(Action.QueryStop)),);

        return request.pipe(map((res: Response) => {
          if (res.text()) {
            try {
              return res.json();
            } catch (err) {
              return res.text();
            }
          }
        }));
      }),);
  }

}
