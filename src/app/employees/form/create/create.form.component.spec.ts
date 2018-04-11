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
import {EmployeeFormComponent, EmployeeSaveEvent} from '../form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CreateEmployeeFormComponent} from './create.form.component';
import {mapEmployee, mapUser} from '../form.mapper';
import {EmployeesStore} from '../../store/index';
import {CREATE} from '../../store/employee.actions';
import {Store} from '@ngrx/store';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FimsSharedModule} from '../../../common/common.module';

const eventMock: EmployeeSaveEvent = {
  detailForm: {
    identifier: 'test',
    firstName: 'test',
    middleName: 'test',
    lastName: 'test',
    password: 'test',
    role: 'test'
  },
  contactForm: {
    email: 'test',
    mobile: 'test',
    phone: 'test'
  },
  officeForm: {
    assignedOffice: 'test'
  }
};

let router: Router;

describe('Test employee form component', () => {

  let fixture: ComponentFixture<CreateEmployeeFormComponent>;

  let testComponent: CreateEmployeeFormComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        EmployeeFormComponent,
        CreateEmployeeFormComponent,
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
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: Store, useClass: class {
          dispatch = jasmine.createSpy('dispatch');
          select = jasmine.createSpy('select').and.returnValue(Observable.empty());
        }},
        {
          provide: EmployeesStore, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty());
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(CreateEmployeeFormComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if employee is created', async(inject([EmployeesStore], (store: EmployeesStore) => {
    fixture.detectChanges();

    testComponent.onSave(eventMock);

    fixture.whenStable().then(() => {
      const employee = mapEmployee(eventMock);
      const user = mapUser(eventMock);

      expect(store.dispatch).toHaveBeenCalledWith({ type: CREATE, payload: {
        employee: employee,
        user: user,
        activatedRoute: {}
      }});
    });
  })));

  xit('should test if error is set on 409', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(testComponent.formComponent.detailForm.get('identifier').errors).toBeDefined();
      expect(testComponent.formComponent.detailForm.get('identifier').errors['unique']).toBeTruthy();
    });
  }));
});
