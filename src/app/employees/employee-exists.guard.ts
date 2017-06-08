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
import {OfficeService} from '../../services/office/office.service';
import * as fromEmployees from './store';
import {Observable} from 'rxjs';
import {LoadAction} from './store/employee.actions';
import {of} from 'rxjs/observable/of';
import {EmployeesStore} from './store/index';
import {ExistsGuardService} from '../../common/guards/exists-guard';

@Injectable()
export class EmployeeExistsGuard implements CanActivate {

  constructor(private store: EmployeesStore,
              private officeService: OfficeService,
              private existsGuardService: ExistsGuardService) {}

  hasEmployeeInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromEmployees.getEmployeesLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasEmployeeInApi(id: string): Observable<boolean> {
    const getEmployee$ = this.officeService.getEmployee(id)
      .map(employeeEntity => new LoadAction({
        resource: employeeEntity
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(employee => !!employee);

    return this.existsGuardService.routeTo404OnError(getEmployee$);
  }

  hasEmployee(id: string): Observable<boolean> {
    return this.hasEmployeeInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasEmployeeInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasEmployee(route.params['id']);
  }
}
