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
import * as fromCustomers from '../../store/index';
import {CustomersStore} from '../../store/index';
import {Observable, of, of as observableOf} from 'rxjs';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {LoadAction} from '../../store/payroll/payroll.actions';
import {PayrollService} from '../../../services/payroll/payroll.service';
import {switchMap, catchError, tap, map} from 'rxjs/operators';

@Injectable()
export class PayrollExistsGuard implements CanActivate {

  constructor(private store: CustomersStore,
              private payrollService: PayrollService,
              private existsGuardService: ExistsGuardService) {}

  hasPayrollInStore(): Observable<boolean> {
    const timestamp$ = this.store.select(fromCustomers.getPayrollDistributionLoadedAt);
    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  loadPayrollFromApi(id: string): Observable<boolean> {
    const getPayroll$ = this.payrollService.findPayrollConfiguration(id, true)
      .pipe(catchError(() => {
        return observableOf({
          mainAccountNumber: '',
          payrollAllocations: []
        });
      }),
      map(distribution => new LoadAction(distribution)),
      tap((action: LoadAction) => this.store.dispatch(action)),
      map(distribution => !!distribution));

    return this.existsGuardService.routeTo404OnError(getPayroll$);
  }

  hasPayroll(id: string): Observable<boolean> {
    return this.hasPayrollInStore().pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.loadPayrollFromApi(id);
      }));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasPayroll(route.parent.params['id']);
  }
}
