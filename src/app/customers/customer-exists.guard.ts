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

import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromCustomers from './store';
import {Observable} from 'rxjs';
import {LoadAction} from './store/customer.actions';
import {of} from 'rxjs/observable/of';
import {CustomerService} from '../../services/customer/customer.service';
import {CustomersStore} from './store/index';

@Injectable()
export class CustomerExistsGuard implements CanActivate {

  constructor(private store: CustomersStore,
              private customerService: CustomerService,
              private router: Router) {}

  hasCustomerInStore(id: string): Observable<boolean> {
    return this.store.select(fromCustomers.getCustomerEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasCustomerInApi(id: string): Observable<boolean> {
    return this.customerService.getCustomer(id)
      .map(customerEntity => new LoadAction(customerEntity))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(customer => !!customer)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
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
