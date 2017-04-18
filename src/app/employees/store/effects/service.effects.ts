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
import {OfficeService} from '../../../../services/office/office.service';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as employeeActions from '../employee.actions';
import {IdentityService} from '../../../../services/identity/identity.service';
import {RoleIdentifier} from '../../../../services/identity/domain/role-identifier.model';
import {Password} from '../../../../services/identity/domain/password.model';

@Injectable()
export class EmployeeApiEffects {

  constructor(private actions$: Actions, private officeService: OfficeService, private identityService: IdentityService) { }

  @Effect()
  createEmployee$: Observable<Action> = this.actions$
    .ofType(employeeActions.CREATE)
    .map((action: employeeActions.CreateEmployeeAction) => action.payload)
    .mergeMap(payload =>
      this.identityService.createUser(payload.user)
        .mergeMap(() => this.officeService.createEmployee(payload.employee) )
        .map(() => new employeeActions.CreateEmployeeSuccessAction({
          resource: payload.employee,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new employeeActions.CreateEmployeeFailAction(error)))
    );

  @Effect()
  updateEmployee$: Observable<Action> = this.actions$
    .ofType(employeeActions.UPDATE)
    .map((action: employeeActions.UpdateEmployeeAction) => action.payload)
    .mergeMap(payload => {
        let employee = payload.employee;
        let httpCalls: Observable<any>[] = [];

        httpCalls.push(this.officeService.updateEmployee(employee));

        if(payload.contactDetails){
          httpCalls.push(this.officeService.setContactDetails(employee.identifier, payload.contactDetails))
        }

        if(payload.role){
          httpCalls.push(this.identityService.changeUserRole(employee.identifier, new RoleIdentifier(payload.role)))
        }

        if(payload.password){
          httpCalls.push(this.identityService.changePassword(employee.identifier, new Password(payload.password)))
        }

        return Observable.forkJoin(httpCalls)
          .map(() => new employeeActions.UpdateEmployeeSuccessAction({
            resource: payload.employee,
            activatedRoute: payload.activatedRoute
          }))
          .catch((error) => of(new employeeActions.UpdateEmployeeFailAction(error)))
    });

  @Effect()
  deleteEmployee$: Observable<Action> = this.actions$
    .ofType(employeeActions.DELETE)
    .map((action: employeeActions.DeleteEmployeeAction) => action.payload)
    .mergeMap(payload => {
      return Observable.forkJoin(
        this.officeService.deleteEmployee(payload.employee.identifier),
        this.identityService.changeUserRole(payload.employee.identifier, new RoleIdentifier('deactivated'))
      )
        .map(() => new employeeActions.DeleteEmployeeSuccessAction({
          resource: payload.employee,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new employeeActions.DeleteEmployeeFailAction(error)))
      }
    );
}
