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
import {ContactDetail} from '../../../services/domain/contact/contact-detail.model';
import {CustomerContactFormComponent} from './contact.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {setValueByCssSelector} from '../../../common/testing/input-fields';
import {TranslateModule} from '@ngx-translate/core';
import {FimsSharedModule} from '../../../common/common.module';
import {MatInputModule} from '@angular/material';

const contactDetails: ContactDetail[] = [
  { group: 'BUSINESS', type: 'EMAIL', value: 'test@test.de', preferenceLevel: 1 },
  { group: 'BUSINESS', type: 'PHONE', value: '1234', preferenceLevel: 1 },
  { group: 'BUSINESS', type: 'MOBILE', value: '5678', preferenceLevel: 1 }
];

describe('Test contact form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        CustomerContactFormComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  });

  it('component should collect only contact fields with values', () => {
    fixture.detectChanges();

    setValueByCssSelector(fixture, '#email', '');
    setValueByCssSelector(fixture, '#phone', '5678');

    fixture.detectChanges();

    const expectedResult: ContactDetail[] = [
      { group: 'BUSINESS', type: 'MOBILE', value: '5678', preferenceLevel: 1 },
      { group: 'BUSINESS', type: 'PHONE', value: '5678', preferenceLevel: 1 }
    ];

    expect(testComponent.formComponent.formData).toEqual(expectedResult);
  });

});

@Component({
  template: '<fims-customer-contact-form #form [formData]="formData"></fims-customer-contact-form>'
})
class TestComponent {

  @ViewChild('form') formComponent: CustomerContactFormComponent;

  formData: ContactDetail[] = contactDetails;

}
