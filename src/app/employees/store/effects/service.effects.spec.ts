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

import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {EffectsRunner, EffectsTestingModule} from '@ngrx/effects/testing';
import {EmployeeApiEffects} from './service.effects';
import {OfficeService} from '../../../../services/office/office.service';
import {IdentityService} from '../../../../services/identity/identity.service';
import {Observable} from 'rxjs';
import {UpdateEmployeeAction, UpdateEmployeePayload, UpdateEmployeeSuccessAction} from '../employee.actions';
import {Employee} from '../../../../services/office/domain/employee.model';

describe('Account Search Api Effects', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        EmployeeApiEffects,
        {
          provide: OfficeService,
          useValue: jasmine.createSpyObj('officeService', ['createEmployee', 'updateEmployee', 'setContactDetails'])
        },
        {
          provide: IdentityService,
          useValue: jasmine.createSpyObj('identityService', ['createUser', 'changeUserRole', 'changePassword'])
        }
      ]
    })

  });

  describe('updateEmployee$', () => {

    function setup() {
      let officeService = TestBed.get(OfficeService);

      officeService.updateEmployee.and.returnValue(Observable.of({}));

      return {
        runner: TestBed.get(EffectsRunner),
        officeService: officeService,
        identityService: TestBed.get(IdentityService),
        employeeEffects: TestBed.get(EmployeeApiEffects)
      };
    }

    it('should update employee', fakeAsync(() => {
      const { runner, officeService, employeeEffects } = setup();

      const employee: Employee = {
        identifier: '',
        givenName: '',
        surname: '',
        contactDetails: []
      };

      const expectedResult = new UpdateEmployeeSuccessAction({
        resource: employee,
        activatedRoute: null
      });

      runner.queue(new UpdateEmployeeAction({
        employee: employee,
        activatedRoute: null
      }));

      let result = null;
      employeeEffects.updateEmployee$.subscribe(_result => result = _result);

      tick();

      expect(result).toEqual(expectedResult);

      expect(officeService.updateEmployee).toHaveBeenCalled();
    }));

    it('should update contact details', fakeAsync(() => {
      const { runner, officeService, employeeEffects } = setup();

      officeService.setContactDetails.and.returnValue(Observable.of({}));

      const employee: Employee = {
        identifier: '',
        givenName: '',
        surname: '',
        contactDetails: []
      };

      const expectedResult = new UpdateEmployeeSuccessAction({
        resource: employee,
        activatedRoute: null
      });

      runner.queue(new UpdateEmployeeAction({
        employee: employee,
        contactDetails: [
          {
            type: 'EMAIL',
            group: 'BUSINESS',
            value: 'dont@call.me',
            preferenceLevel: 0
          }
        ],
        activatedRoute: null
      }));

      let result = null;
      employeeEffects.updateEmployee$.subscribe(_result => result = _result);

      tick();

      expect(result).toEqual(expectedResult);

      expect(officeService.setContactDetails).toHaveBeenCalled();
    }));

    it('should update password', fakeAsync(() => {
      const { runner, identityService, employeeEffects } = setup();

      identityService.changePassword.and.returnValue(Observable.of({}));

      const employee: Employee = {
        identifier: '',
        givenName: '',
        surname: '',
        contactDetails: []
      };

      const expectedResult = new UpdateEmployeeSuccessAction({
        resource: employee,
        activatedRoute: null
      });

      runner.queue(new UpdateEmployeeAction({
        employee: employee,
        password: 'test',
        activatedRoute: null
      }));

      let result = null;
      employeeEffects.updateEmployee$.subscribe(_result => result = _result);

      tick();

      expect(result).toEqual(expectedResult);

      expect(identityService.changePassword).toHaveBeenCalled();
    }));

    it('should update role', fakeAsync(() => {
      const { runner, identityService, employeeEffects } = setup();

      identityService.changeUserRole.and.returnValue(Observable.of({}));

      const employee: Employee = {
        identifier: '',
        givenName: '',
        surname: '',
        contactDetails: []
      };

      const expectedResult = new UpdateEmployeeSuccessAction({
        resource: employee,
        activatedRoute: null
      });

      runner.queue(new UpdateEmployeeAction({
        employee: employee,
        role: 'test',
        activatedRoute: null
      }));

      let result = null;
      employeeEffects.updateEmployee$.subscribe(_result => result = _result);

      tick();

      expect(result).toEqual(expectedResult);

      expect(identityService.changeUserRole).toHaveBeenCalled();
    }));
  })
});
