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

import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {EmployeeFormComponent, EmployeeSaveEvent} from '../form.component';
import {SelectListComponent} from '../../../../common/select-list/select-list.component';
import {IdInputComponent} from '../../../../common/id-input/id-input.component';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutCardOverComponent} from '../../../../common/layout-card-over/layout-card-over.component';
import {Observable} from 'rxjs';
import {CreateEmployeeFormComponent} from './create.form.component';
import {mapEmployee, mapUser} from '../form.mapper';
import {EmployeesStore} from '../../store/index';
import {CREATE} from '../../store/employee.actions';
import {Store} from '@ngrx/store';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormContinueActionComponent} from '../../../../common/forms/form-continue-action.component';
import {FormFinalActionComponent} from '../../../../common/forms/form-final-action.component';
import {MdCardModule, MdInputModule, MdOptionModule, MdSelectModule} from '@angular/material';


let eventMock: EmployeeSaveEvent = {
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
let activatedRoute: ActivatedRoute;

describe('Test employee form component', () => {

  let fixture: ComponentFixture<CreateEmployeeFormComponent>;

  let testComponent: CreateEmployeeFormComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        LayoutCardOverComponent,
        IdInputComponent,
        FormContinueActionComponent,
        FormFinalActionComponent,
        SelectListComponent,
        EmployeeFormComponent,
        CreateEmployeeFormComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MdInputModule,
        MdCardModule,
        MdSelectModule,
        MdOptionModule,
        CovalentStepsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: router},
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: Store, useClass: class {
          dispatch = jasmine.createSpy('dispatch');
          select = jasmine.createSpy('select').and.returnValue(Observable.empty())
        }},
        {
          provide: EmployeesStore, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty())
          }
        }
      ]
    });

    fixture = TestBed.createComponent(CreateEmployeeFormComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if employee is created', async(inject([EmployeesStore], (store: EmployeesStore) => {
    fixture.detectChanges();

    testComponent.onSave(eventMock);

    fixture.whenStable().then(() => {
      let employee = mapEmployee(eventMock);
      let user = mapUser(eventMock);

      expect(store.dispatch).toHaveBeenCalledWith({ type: CREATE, payload: {
        employee: employee,
        user: user,
        activatedRoute: activatedRoute
      }});
    })
  })));

  xit('should test if error is set on 409', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(testComponent.formComponent.detailForm.get('identifier').errors).toBeDefined();
      expect(testComponent.formComponent.detailForm.get('identifier').errors['unique']).toBeTruthy();
    })
  }));
});
