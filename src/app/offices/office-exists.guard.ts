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
import {OfficeService} from '../../services/office/office.service';
import {State, getOfficeEntities, OfficesStore} from './store';
import {Observable} from 'rxjs/Observable';
import {LoadAction} from './store/office.actions';
import {of} from 'rxjs/observable/of';

@Injectable()
export class OfficeExistsGuard implements CanActivate {

  constructor(private store: OfficesStore,
              private officeService: OfficeService,
              private router: Router) {}

  hasOfficeInStore(id: string): Observable<boolean> {
    return this.store.select(getOfficeEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasOfficeInApi(id: string): Observable<boolean> {
    return this.officeService.getOffice(id)
      .map(officeEntity => new LoadAction(officeEntity))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(office => !!office)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  hasOffice(id: string): Observable<boolean> {
    return this.hasOfficeInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasOfficeInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasOffice(route.params['id']);
  }
}
