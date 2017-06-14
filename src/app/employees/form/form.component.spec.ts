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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, EventEmitter, ViewChild} from '@angular/core';
import {Employee} from '../../../services/office/domain/employee.model';
import {EmployeeFormComponent, EmployeeFormData, EmployeeSaveEvent} from './form.component';
import {User} from '../../../services/identity/domain/user.model';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {IdInputComponent} from '../../../common/id-input/id-input.component';
import {SelectListComponent} from '../../../common/select-list/select-list.component';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormContinueActionComponent} from '../../../common/forms/form-continue-action.component';
import {FormFinalActionComponent} from '../../../common/forms/form-final-action.component';
import {MdIconModule, MdInputModule, MdOptionModule, MdSelectModule} from '@angular/material';

let employeeTemplate: Employee = {
  identifier: 'test',
  givenName: 'test',
  middleName: 'test',
  surname: 'test',
  contactDetails: [{
    type: 'EMAIL',
    group: 'BUSINESS',
    value: 'test@test.de',
    preferenceLevel: 0
  }],
  assignedOffice: 'test'
};

let userTemplate: User = {
  identifier: 'test',
  role: 'test'
};

describe('Test employee form component', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        IdInputComponent,
        FormContinueActionComponent,
        FormFinalActionComponent,
        SelectListComponent,
        TestComponent,
        EmployeeFormComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MdSelectModule,
        MdOptionModule,
        MdIconModule,
        MdInputModule,
        CovalentStepsModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: Store, useClass: class {
          dispatch = jasmine.createSpy('dispatch');
          select = jasmine.createSpy('select').and.returnValue(Observable.empty())
        }}
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if the form save the original values', () => {
    fixture.detectChanges();

    testComponent.saveEmitter.subscribe((saveEvent: EmployeeSaveEvent) => {
      expect(employeeTemplate.identifier).toEqual(saveEvent.detailForm.identifier);
      expect(employeeTemplate.givenName).toEqual(saveEvent.detailForm.firstName);
      expect(employeeTemplate.middleName).toEqual(saveEvent.detailForm.middleName);
      expect(employeeTemplate.surname).toEqual(saveEvent.detailForm.lastName);
      expect(saveEvent.detailForm.password).toEqual('');

      expect(employeeTemplate.assignedOffice).toEqual(saveEvent.officeForm.assignedOffice);

      expect(employeeTemplate.contactDetails.length).toEqual(1);
      expect(employeeTemplate.contactDetails[0].value).toEqual(saveEvent.contactForm.email);

      expect(userTemplate.role).toEqual(saveEvent.detailForm.role);
    });

    testComponent.triggerSave();

  });
});

@Component({
  template: '<fims-employee-form-component #form (onSave)="onSave($event)" (onCancel)="onCancel($event)" [formData]="employeeFormData"></fims-employee-form-component>'
})
class TestComponent{

  saveEmitter = new EventEmitter<EmployeeSaveEvent>();

  @ViewChild('form') formComponent: EmployeeFormComponent;

  employeeFormData: EmployeeFormData = {
    employee: employeeTemplate,
    user: userTemplate
  };

  triggerSave(): void{
    this.formComponent.save();
  }

  onSave(event: EmployeeSaveEvent): void{
    this.saveEmitter.emit(event);
  }

}
