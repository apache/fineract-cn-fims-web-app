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
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {TellerStore} from '../store/index';
import {CustomerService} from '../../../services/customer/customer.service';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {Observable} from 'rxjs/Observable';
import {LoadCustomerAction} from '../store/teller.actions';
import {of} from 'rxjs/observable/of';
import * as fromTeller from '../store/index';

@Injectable()
export class TellerCustomerExistsGuard implements CanActivate {

  constructor(private store: TellerStore,
              private customerService: CustomerService,
              private existsGuardService: ExistsGuardService) {
  }

  hasCustomerInStore(id: string): Observable<boolean> {
    const timestamp$: Observable<number> = this.store.select(fromTeller.getTellerCustomerLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasCustomerInApi(id: string): Observable<boolean> {
    const getCustomer$: Observable<any> = this.customerService.getCustomer(id)
      .map(customerEntity => new LoadCustomerAction({
        resource: customerEntity
      }))
      .do((action: LoadCustomerAction) => this.store.dispatch(action))
      .map(customer => !!customer);

    return this.existsGuardService.routeTo404OnError(getCustomer$);
  }

  hasCustomer(id: string): Observable<boolean> {
    return this.hasCustomerInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasCustomerInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasCustomer(route.params['id']);
  }
}
