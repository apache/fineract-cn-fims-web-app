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

import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromCustomers from '../../store/index';
import {CustomersStore} from '../../store/index';
import {Observable} from 'rxjs';
import {of} from 'rxjs/observable/of';
import {CustomerService} from '../../../services/customer/customer.service';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {LoadAction} from '../../store/payroll/payroll.actions';
import {PayrollDistribution} from '../../../services/customer/domain/payroll-distribution.model';

@Injectable()
export class PayrollExistsGuard implements CanActivate {

  constructor(private store: CustomersStore,
              private customerService: CustomerService,
              private existsGuardService: ExistsGuardService) {}

  hasPayrollInStore(): Observable<boolean> {
    const timestamp$ = this.store.select(fromCustomers.getPayrollDistributionLoadedAt);
    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  loadPayrollFromApi(id: string): Observable<boolean> {
    const getEmployee$ = this.customerService.getPayrollDistribution(id)
      .map(distribution => this.emptyIfNull(distribution))
      .map(distribution => new LoadAction(distribution))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(distribution => !!distribution);

    return this.existsGuardService.routeTo404OnError(getEmployee$);
  }

  private emptyIfNull(distribution: PayrollDistribution): PayrollDistribution {
    if(!distribution) {
      return {
        mainAccountNumber: '',
        payrollAllocations: []
      }
    }

    return distribution;
  }

  hasPayroll(id: string): Observable<boolean> {
    return this.hasPayrollInStore()
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.loadPayrollFromApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasPayroll(route.parent.params['id']);
  }
}
