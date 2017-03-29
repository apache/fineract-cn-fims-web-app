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
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import * as fromRoot from '../../../app/reducers';
import {Store} from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  waitForAuthentication(): Observable<boolean> {
    return this.store.select(fromRoot.getAuthenticationLoading)
      .filter(loading => !loading)
      .take(1)
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.waitForAuthentication()
      .switchMap(() => this.store.select(fromRoot.getAuthentication)
        .map(authentication => {
          if (!authentication) {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        })
      );

  }
}
