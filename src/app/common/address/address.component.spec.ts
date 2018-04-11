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
import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AddressFormComponent} from './address.component';
import {Address} from '../../services/domain/address/address.model';
import {CountryService} from '../../services/country/country.service';
import {Country} from '../../services/country/model/country.model';
import {FimsSharedModule} from '../common.module';
import {MatAutocompleteModule, MatInputModule} from '@angular/material';

const country: Country = {
  displayName: 'country',
  name: 'country',
  alpha2Code: 'countryCode',
  translations: {}
};

describe('Test address form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        MatInputModule,
        MatAutocompleteModule,
        CovalentStepsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [
        TestComponent
      ],
      providers: [
        {
          provide: CountryService, useClass: class {
            fetchByCountryCode = jasmine.createSpy('fetchByCountryCode').and.returnValue(country);
            fetchCountries = jasmine.createSpy('fetchCountries').and.returnValue([country]);
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture  = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return same address', () => {
    expect(testComponent.form.formData).toEqual(testComponent.address);
  });

});

@Component({
  template: '<fims-address-form #form [formData]="address"></fims-address-form>'
})
class TestComponent {

  @ViewChild('form') form: AddressFormComponent;

  address: Address = {
    street: 'street',
    city: 'city',
    region: 'region',
    postalCode: 'postalCode',
    countryCode: 'countryCode',
    country: 'country'
  };

}
