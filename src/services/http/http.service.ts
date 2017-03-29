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
import {Http, RequestOptions, RequestOptionsArgs, RequestMethod, Request, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/reducers';
import {Authentication} from '../identity/domain/authentication.model';
import {LOGOUT} from '../../app/reducers/security/security.actions';

export enum Action { QueryStart, QueryStop }

export const TENANT_HEADER: string = 'X-Tenant-Identifier';
export const USER_HEADER: string = 'User';
export const AUTHORIZATION_HEADER: string = 'Authorization';

@Injectable()
export class HttpClient {

  private headers: Headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  });

  process: Subject<Action> = new Subject<Action>();

  error: Subject<any> = new Subject<any>();

  constructor(private http: Http, private store: Store<fromRoot.State>) {}

  public get(url: string, options?: RequestOptionsArgs, silent?: boolean): Observable<any> {
    return this.createRequest(RequestMethod.Get, url, undefined, options, silent);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.createRequest(RequestMethod.Post, url, body, options);
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.createRequest(RequestMethod.Put, url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.createRequest(RequestMethod.Delete, url, undefined, options);
  }

  private _buildRequestOptions(method: RequestMethod, url: string, body: any, tenant: string, username: string, accessToken: string, options?: RequestOptionsArgs): RequestOptions{
    options = options || {};

    this.headers.set(TENANT_HEADER, tenant);

    this.headers.delete(USER_HEADER);
    this.headers.delete(AUTHORIZATION_HEADER);

    this.headers.set(USER_HEADER, username);
    this.headers.set(AUTHORIZATION_HEADER, accessToken);

    let requestOptions: RequestOptions = new RequestOptions({
      method: method,
      url: url,
      body: JSON.stringify(body),
      headers: this.headers
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
            if(silent) return Observable.throw(err);

            switch (err.status) {
              case 409:
                return Observable.throw(err);
              case 401:
              case 403:
                this.store.dispatch({ type: LOGOUT });
                return Observable.throw('User is not authenticated');
              default:
                this.error.next(err);
                return Observable.throw(err);
            }
          }).finally(() => this.process.next(Action.QueryStop));

        return request.map((res: Response) => {
          if(res.text()){
            return res.json()
          }
        });
      });

  }

}
