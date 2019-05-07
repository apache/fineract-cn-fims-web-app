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
import * as fromCustomers from '../../store';
import {Observable, of} from 'rxjs';
import {CustomersStore} from '../../store/index';
import {CustomerService} from '../../../services/customer/customer.service';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {LoadAction} from '../../store/identityCards/identity-cards.actions';
import {switchMap, map, tap} from 'rxjs/operators';

@Injectable()
export class IdentityCardExistsGuard implements CanActivate {

  constructor(private store: CustomersStore,
              private customerService: CustomerService,
              private existsGuardService: ExistsGuardService) {
  }

  hasIdentificationCardInStore(number: string): Observable<boolean> {
    const timestamp$: Observable<number> = this.store.select(fromCustomers.getIdentificationCardLoadedAt).pipe(
      map(loadedAt => loadedAt[number]));

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasIdentificationCardInApi(customerId: string, number: string): Observable<boolean> {
    const getIdentificationCard: Observable<any> = this.customerService.getIdentificationCard(customerId, number).pipe(
      map(identificationCardEntity => new LoadAction({
        resource: identificationCardEntity
      })),
      tap((action: LoadAction) => this.store.dispatch(action)),
      map(identificationCard => !!identificationCard));

    return this.existsGuardService.routeTo404OnError(getIdentificationCard);
  }

  hasIdentificationCard(customerId: string, number: string): Observable<boolean> {
    return this.hasIdentificationCardInStore(number).pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasIdentificationCardInApi(customerId, number);
      }));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasIdentificationCard(route.parent.params['id'], route.params['number']);
  }
}
