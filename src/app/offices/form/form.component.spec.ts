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
import {Component, EventEmitter, ViewChild} from '@angular/core';
import {Office} from '../../services/office/domain/office.model';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OfficeFormComponent} from './form.component';
import {TranslateModule} from '@ngx-translate/core';
import {CovalentStepsModule} from '@covalent/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule, MatInputModule} from '@angular/material';
import {CountryService} from '../../services/country/country.service';
import {Country} from '../../services/country/model/country.model';
import {FimsSharedModule} from '../../common/common.module';

const officeTemplate: Office = {
  identifier: 'test',
  name: 'test',
  description: 'test',
  address: {
    street: 'street',
    city: 'city',
    region: 'region',
    postalCode: '12345',
    countryCode: 'CC',
    country: 'country'
  }
};

const country: Country = {
  displayName: '',
  name: officeTemplate.address.country,
  alpha2Code: officeTemplate.address.countryCode,
  translations: {}
};

describe('Test office form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FimsSharedModule,
        MatInputModule,
        MatAutocompleteModule,
        CovalentStepsModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        {
          // Used by address component
          provide: CountryService, useClass: class {
            fetchByCountryCode = jasmine.createSpy('fetchByCountryCode').and.returnValue(country);
            fetchCountries = jasmine.createSpy('fetchCountries').and.returnValue([country]);
          }
        }
      ],
      declarations: [
        OfficeFormComponent,
        TestComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  });

  it('should save address when pristine', (done: DoneFn) => {
    fixture.detectChanges();
    testComponent.saveEmitter.subscribe((office) => {
      expect(office.identifier).toBe(officeTemplate.identifier);
      expect(office.name).toBe(officeTemplate.name);
      expect(office.description).toBe(officeTemplate.description);

      expect(office.address).toBeDefined();

      expect(office.address.street).toBe(officeTemplate.address.street);
      expect(office.address.city).toBe(officeTemplate.address.city);
      expect(office.address.region).toBe(officeTemplate.address.region);
      expect(office.address.postalCode).toBe(officeTemplate.address.postalCode);
      expect(office.address.countryCode).toBe(officeTemplate.address.countryCode);
      expect(office.address.country).toBe(officeTemplate.address.country);

      done();
    });

    testComponent.triggerSave();
  });

});

@Component({
  template: `
    <fims-office-form-component #form (onSave)="onSave($event)" (onCancel)="onCancel($event)" [office]="office" [editMode]="false">
    </fims-office-form-component>`
})
class TestComponent {

  saveEmitter = new EventEmitter<Office>();

  @ViewChild('form') formComponent: OfficeFormComponent;

  office: Office = officeTemplate;

  triggerSave(): void {
    this.formComponent.save();
  }

  onSave(office: Office): void {
    this.saveEmitter.emit(office);
  }

  onCancel(): void {}
}
