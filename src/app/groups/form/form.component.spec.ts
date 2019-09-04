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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupDetailFormComponent } from './detail/detail.component';
import { GroupFormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CovalentChipsModule, CovalentStepsModule } from '@covalent/core';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Group } from '../../services/group/domain/group.model';
import { TranslateModule } from '@ngx-translate/core';
import { GroupEmployeesComponent } from './employees/employees.component';
import { GroupOfficesComponent } from './offices/offices.component';
import { GroupCustomersComponent } from './customers/customers.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { GroupsStore } from '../store/index';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CountryService } from '../../services/country/country.service';
import { Country } from '../../services/country/model/country.model';
import { FimsSharedModule } from '../../common/common.module';
import {
  MatAutocompleteModule, MatCheckboxModule, MatIconModule, MatInputModule,
  MatRadioModule, MatSelectModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

const groupTemplate: Group = {
  identifier: 'test',
  groupDefinitionIdentifier: 'test',
  name: 'test',
  leaders: ['test', 'test1', 'test2'],
  members: ['test', 'test1', 'test2'],
  office: 'test',
  assignedEmployee: 'test',
  weekday: 1,
  status: 'PENDING',
  address: {
    street: 'test',
    city: 'test',
    countryCode: 'te',
    country: 'test',
    region: 'test',
    postalCode: 'test'
  }

};
const country: Country = {
  displayName: '',
  name: groupTemplate.address.country,
  alpha2Code: groupTemplate.address.countryCode,
  translations: {}
};


describe('Test group form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        GroupFormComponent,
        GroupDetailFormComponent,
        GroupEmployeesComponent,
        GroupOfficesComponent,
        GroupCustomersComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSelectModule,
        CovalentStepsModule,
        CovalentChipsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {

          provide: CountryService, useClass: class {
            fetchByCountryCode = jasmine.createSpy('fetchByCountryCode').and.returnValue(country);
            fetchCountries = jasmine.createSpy('fetchCountries').and.returnValue([country]);
          }
        },
        {
          provide: GroupsStore, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty());
          }
        },
        {
          provide: Store, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty());
          }
        }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if the form save the original values', () => {
    fixture.detectChanges();

    testComponent.saveEmitter.subscribe((group) => {
      expect(groupTemplate.identifier).toEqual(group.identifier);
      expect(groupTemplate.groupDefinitionIdentifier).toEqual(group.groupDefinitionIdentifier);
      expect(groupTemplate.name).toEqual(group.name);
      expect(groupTemplate.leaders).toEqual(group.leaders);
      expect(groupTemplate.members).toEqual(group.members);
      expect(groupTemplate.office).toEqual(group.office);
      expect(groupTemplate.assignedEmployee).toEqual(group.assignedEmployee);
      expect(groupTemplate.weekday).toEqual(group.weekday);
      expect(groupTemplate.status).toEqual(group.status);
      expect(groupTemplate.address.city).toEqual(group.address.city);
      expect(groupTemplate.address.country).toEqual(group.address.country);
      expect(groupTemplate.address.countryCode).toEqual(group.address.countryCode);
      expect(groupTemplate.address.postalCode).toEqual(group.address.postalCode);
      expect(groupTemplate.address.region).toEqual(group.address.region);
      expect(groupTemplate.address.street).toEqual(group.address.street);

    });

    testComponent.triggerSave();
  });

});

@Component({
  template: `
    <fims-group-form-component #form (onSave)="onSave($event)" (onCancel)="onCancel($event)" [group]="group">
    </fims-group-form-component>
  `
})
class TestComponent {

  saveEmitter = new EventEmitter<Group>();

  @ViewChild('form') formComponent: GroupFormComponent;

  group: Group = groupTemplate;

  triggerSave(): void {
    this.formComponent.save();
  }

  onSave(group: Group): void {
    this.saveEmitter.emit(group);
  }

  onCancel(): void { }
}
