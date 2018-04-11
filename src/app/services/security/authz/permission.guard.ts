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
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {FimsPermission} from './fims-permission.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';

@Injectable()
export class PermissionGuard implements CanActivateChild {

  constructor(private store: Store<fromRoot.State>, private router: Router) {
  }

  waitForPermissions(): Observable<boolean> {
    return this.store.select(fromRoot.getPermissionsLoading)
      .filter(loading => !loading)
      .take(1);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const routeData: any = route.data;

    const routePermission: FimsPermission = routeData.hasPermission;

    // No permission set on route at all
    if (!routePermission) {
      return Observable.of(true);
    }

    return this.waitForPermissions()
      .switchMap(() => this.hasPermission(routePermission)
        .map(hasPermission => {
          if (hasPermission) {
            return true;
          }
          this.router.navigate(['/denied']);
          return false;
        }));

  }

  private hasPermission(routePermission: FimsPermission): Observable<boolean> {
    return this.store.select(fromRoot.getPermissions)
      .map(permissions => permissions.filter(permission => permission.id === routePermission.id
        && permission.accessLevel === routePermission.accessLevel))
      .map(matches => matches.length > 0)
      .take(1);
  }
}
