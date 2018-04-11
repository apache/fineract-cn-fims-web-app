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
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import * as fromCustomers from '../store/index';
import {CustomersStore} from '../store/index';
import {CatalogService} from '../../services/catalog/catalog.service';
import {ExistsGuardService} from '../../common/guards/exists-guard';
import {Observable} from 'rxjs/Observable';
import {LoadAction} from '../store/catalogs/catalog.actions';
import {of} from 'rxjs/observable/of';

@Injectable()
export class CatalogExistsGuard implements CanActivate {

  constructor(private store: CustomersStore,
              private catalogService: CatalogService,
              private existsGuardService: ExistsGuardService) {
  }

  hasCatalogInStore(): Observable<boolean> {
    const timestamp$: Observable<number> = this.store.select(fromCustomers.getCustomerCatalogLoadedAt);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasCatalogInApi(id: string): Observable<boolean> {
    return this.catalogService.findCatalog(id, true)
      .catch(() => {
        return Observable.of(null);
      })
      .map(catalogEntity => new LoadAction(catalogEntity))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(catalog => !!catalog);
  }

  hasCatalog(id: string): Observable<boolean> {
    return this.hasCatalogInStore()
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasCatalogInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasCatalog('customers');
  }
}
