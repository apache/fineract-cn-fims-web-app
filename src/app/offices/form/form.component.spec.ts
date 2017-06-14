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

import {Component, EventEmitter, ViewChild} from '@angular/core';
import {Office} from '../../../services/office/domain/office.model';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OfficeFormComponent} from './form.component';
import {TranslateModule} from '@ngx-translate/core';
import {CovalentStepsModule} from '@covalent/core';
import {ReactiveFormsModule} from '@angular/forms';
import {IdInputComponent} from '../../../common/id-input/id-input.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormFinalActionComponent} from '../../../common/forms/form-final-action.component';
import {FormContinueActionComponent} from '../../../common/forms/form-continue-action.component';
import {MdAutocompleteModule, MdInputModule} from '@angular/material';
import {AddressFormComponent} from '../../../common/address/address.component';
import {CountryService} from '../../../services/country/country.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

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
  }};

describe('Test office form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MdInputModule,
        MdAutocompleteModule,
        CovalentStepsModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        {
          // Used by address component
          provide: CountryService, useClass: class {
            fetchByCountryCode = jasmine.createSpy('fetchByCountryCode').and.returnValue({
              displayName: '',
              name: officeTemplate.address.country,
              alpha2Code: officeTemplate.address.countryCode
            })
          }
        },
        {
          provide: Store, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty())
          }
        }
      ],
      declarations: [
        IdInputComponent,
        FormContinueActionComponent,
        FormFinalActionComponent,
        OfficeFormComponent,
        AddressFormComponent,
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
  template: '<fims-office-form-component #form (onSave)="onSave($event)" (onCancel)="onCancel($event)" [office]="office" [editMode]="false"></fims-office-form-component>'
})
class TestComponent{

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
