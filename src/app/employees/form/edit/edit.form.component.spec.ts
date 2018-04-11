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
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {EditEmployeeFormComponent} from './edit.form.component';
import {EmployeeFormComponent} from '../form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../services/identity/domain/user.model';
import {Employee} from '../../../services/office/domain/employee.model';
import {Observable} from 'rxjs/Observable';
import {EmployeesStore} from '../../store/index';
import {Store} from '@ngrx/store';
import {UPDATE} from '../../store/employee.actions';
import * as fromEmployees from '../../store';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FimsSharedModule} from '../../../common/common.module';

const userMock: User = {
  identifier: 'test',
  role: 'test'
};

const employeeMock: Employee = {
  identifier: 'test',
  assignedOffice: 'test',
  givenName: 'test',
  middleName: 'test',
  surname: 'test',
  contactDetails: [
    {
      group: 'BUSINESS',
      type: 'EMAIL',
      value: 'test',
      preferenceLevel: 1
    }
  ]
};

const activatedRoute = {
  data: Observable.of({
    user: userMock
  })
};
let router: Router;

describe('Test employee form component', () => {

  let fixture: ComponentFixture<EditEmployeeFormComponent>;

  let testComponent: EditEmployeeFormComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        EmployeeFormComponent,
        EditEmployeeFormComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatOptionModule,
        CovalentStepsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: router},
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: Store, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty());
          }
        },
        {
          provide: EmployeesStore, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.callFake(selector => {
              if (selector === fromEmployees.getSelectedEmployee) {
                return Observable.of(employeeMock);
              }

              return Observable.empty();
            });
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(EditEmployeeFormComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if employee is updated', async(inject([EmployeesStore], (store: EmployeesStore) => {
    fixture.detectChanges();

    testComponent.formComponent.detailForm.get('password').setValue('newPassword');

    fixture.detectChanges();

    testComponent.formComponent.save();

    fixture.whenStable().then(() => {
      expect(store.dispatch).toHaveBeenCalledWith({ type: UPDATE, payload: {
        employee: employeeMock,
        contactDetails: employeeMock.contactDetails,
        role: userMock.role,
        password: 'newPassword',
        activatedRoute: activatedRoute
      }});
    });

  })));
});
