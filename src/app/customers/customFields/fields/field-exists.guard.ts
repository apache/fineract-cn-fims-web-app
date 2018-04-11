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
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {CustomersStore} from '../../store/index';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {Observable} from 'rxjs/Observable';
import * as fromCustomers from '../../store';

@Injectable()
export class FieldExistsGuard implements CanActivate {

  constructor(private store: CustomersStore,
              private existsGuardService: ExistsGuardService) {
  }

  hasFieldInCatalog(id: string): Observable<boolean> {
    const getField$ = this.store.select(fromCustomers.getCustomerCatalog)
      .map(catalog => catalog.fields.find(field => field.identifier === id))
      .map(field => !!field);

    return this.existsGuardService.routeTo404OnError(getField$);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasFieldInCatalog(route.params['fieldId']);
  }
}
