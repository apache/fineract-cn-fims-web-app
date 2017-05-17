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
import {Headers, Http, Response, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/reducers';
import {AUTHORIZATION_HEADER, TENANT_HEADER, USER_HEADER} from '../http/http.service';
import {State} from '../../app/reducers/security/authentication.reducer';

@Injectable()
export class ImageService {

  constructor(private http: Http, private store: Store<fromRoot.State>) {}

  public getImage(url: string): Observable<Blob> {
    return this.store.select(fromRoot.getAuthenticationState)
      .take(1)
      .map(this.mapHeader)
      .switchMap((headers: Headers) =>
        this.http.get(url, {
          responseType: ResponseContentType.Blob,
          headers: headers
        })
        .map((response: Response) => response.blob())
        .catch(() => Observable.empty()));
  }

  private mapHeader(authenticationState: State): Headers {
    const headers = new Headers();

    headers.set('Accept', 'application/json');

    headers.set(TENANT_HEADER, authenticationState.tenant);
    headers.set(USER_HEADER, authenticationState.username);
    headers.set(AUTHORIZATION_HEADER, authenticationState.authentication.accessToken);

    return headers;
  }

}
