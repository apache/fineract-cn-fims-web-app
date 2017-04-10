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

import {Store} from '@ngrx/store';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromRoles from './store';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {IdentityService} from '../../services/identity/identity.service';
import {LoadAction} from './store/role.actions';

@Injectable()
export class RoleExistsGuard implements CanActivate {

  constructor(private store: Store<fromRoles.State>,
              private identityService: IdentityService,
              private router: Router) {}

  hasRoleInStore(id: string): Observable<boolean> {
    return this.store.select(fromRoles.getRoleEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasRoleInApi(id: string): Observable<boolean> {
    return this.identityService.getRole(id)
      .map(roleEntity => new LoadAction(roleEntity))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(office => !!office)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  hasRole(id: string): Observable<boolean> {
    return this.hasRoleInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasRoleInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasRole(route.params['id']);
  }
}
