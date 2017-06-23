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
import {CustomerDetailFormComponent} from './detail/detail.component';
import {CustomerFormComponent} from './form.component';
import {CustomerContactFormComponent} from './contact/contact.component';
import {AddressFormComponent} from '../../../common/address/address.component';
import {CustomerCustomFieldsComponent} from './customFields/custom-fields.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {Component, EventEmitter, ViewChild} from '@angular/core';
import {Customer} from '../../../services/customer/domain/customer.model';
import {TranslateModule} from '@ngx-translate/core';
import {CustomerEmployeesComponent} from './employees/employees.component';
import {CustomerOfficesComponent} from './offices/offices.component';
import {IdInputComponent} from '../../../common/id-input/id-input.component';
import {SelectListComponent} from '../../../common/select-list/select-list.component';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {CustomersStore} from '../store/index';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdAutocompleteModule, MdCheckboxModule, MdIconModule, MdInputModule, MdRadioModule} from '@angular/material';
import {FormContinueActionComponent} from '../../../common/forms/form-continue-action.component';
import {FormFinalActionComponent} from '../../../common/forms/form-final-action.component';
import {CountryService} from '../../../services/country/country.service';

const customerTemplate: Customer = {
  identifier: 'test',
  type: 'PERSON',
  givenName: 'test',
  middleName: 'test',
  surname: 'test',
  address: {
    street: 'test',
    city: 'test',
    countryCode: 'te',
    country: 'test',
    region: 'test',
    postalCode: 'test'
  },
  dateOfBirth: {
    year: 1982,
    month: 6,
    day: 24
  },
  member: true,
  identificationCard: {
    issuer: 'test',
    expirationDate: {
      year: 1982,
      month: 6,
      day: 24
    },
    type: 'passport',
    number: '12312'
  },
  contactDetails: [{
    type: 'EMAIL',
    group: 'BUSINESS',
    value: 'test@test.de',
    preferenceLevel: 0
  }],
  customValues: []
};

describe('Test customer form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        IdInputComponent,
        FormContinueActionComponent,
        FormFinalActionComponent,
        SelectListComponent,
        CustomerFormComponent,
        CustomerDetailFormComponent,
        CustomerContactFormComponent,
        AddressFormComponent,
        CustomerCustomFieldsComponent,
        CustomerEmployeesComponent,
        CustomerOfficesComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MdInputModule,
        MdIconModule,
        MdRadioModule,
        MdAutocompleteModule,
        MdCheckboxModule,
        CovalentStepsModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          // Used by address component
          provide: CountryService, useClass: class {
            fetchByCountryCode = jasmine.createSpy('fetchByCountryCode').and.returnValue({
              displayName: '',
              name: customerTemplate.address.country,
              alpha2Code: customerTemplate.address.countryCode
            })
          }
        },
        {
          provide: CustomersStore, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty())
          }
        },
        {
          provide: Store, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty())
          }
        }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if the form save the original values', () => {
    fixture.detectChanges();

    testComponent.saveEmitter.subscribe((customer: Customer) => {
      expect(customerTemplate.identifier).toEqual(customer.identifier);
      expect(customerTemplate.type).toEqual(customer.type);
      expect(customerTemplate.givenName).toEqual(customer.givenName);
      expect(customerTemplate.middleName).toEqual(customer.middleName);
      expect(customerTemplate.surname).toEqual(customer.surname);

      expect(customerTemplate.accountBeneficiary).toEqual(customer.accountBeneficiary);
      expect(customerTemplate.referenceCustomer).toEqual(customer.referenceCustomer);
      expect(customerTemplate.assignedOffice).toEqual(customer.assignedOffice);
      expect(customerTemplate.assignedEmployee).toEqual(customer.assignedEmployee);

      expect(customerTemplate.address.city).toEqual(customer.address.city);
      expect(customerTemplate.address.country).toEqual(customer.address.country);
      expect(customerTemplate.address.countryCode).toEqual(customer.address.countryCode);
      expect(customerTemplate.address.postalCode).toEqual(customer.address.postalCode);
      expect(customerTemplate.address.region).toEqual(customer.address.region);
      expect(customerTemplate.address.street).toEqual(customer.address.street);

      expect(customerTemplate.dateOfBirth.day).toEqual(customer.dateOfBirth.day);
      expect(customerTemplate.dateOfBirth.month).toEqual(customer.dateOfBirth.month);
      expect(customerTemplate.dateOfBirth.year).toEqual(customer.dateOfBirth.year);

      expect(customer.contactDetails.length).toEqual(0);
    });

    testComponent.triggerSave();
  })

});

@Component({
  template: '<fims-customer-form-component #form (onSave)="onSave($event)" (onCancel)="onCancel($event)" [customer]="customer"></fims-customer-form-component>'
})
class TestComponent {

  saveEmitter = new EventEmitter<Customer>();

  @ViewChild('form') formComponent: CustomerFormComponent;

  customer: Customer = customerTemplate;

  triggerSave(): void {
    this.formComponent.save();
  }

  onSave(customer: Customer): void {
    this.saveEmitter.emit(customer);
  }

  onCancel(): void {}
}
