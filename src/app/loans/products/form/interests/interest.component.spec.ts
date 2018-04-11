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
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {InterestFormData, ProductInterestFormComponent} from './interests.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {FimsSharedModule} from '../../../../common/common.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule, MatRadioModule, MatSlideToggleModule} from '@angular/material';

describe('Test product interest component', () => {

  const validFormData: InterestFormData = {
    minimum: '1.23',
    maximum: '4.56',
    accrualAccount: 'accrualAccount',
    incomeAccount: 'incomeAccount'
  };

  const invalidFormData: InterestFormData = {
    minimum: '4.56',
    maximum: '1.23',
    accrualAccount: 'accrualAccount',
    incomeAccount: 'incomeAccount'
  };

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatInputModule,
        MatRadioModule,
        MatSlideToggleModule,
        FimsSharedModule,
        NoopAnimationsModule
      ],
      declarations: [
        TestComponent,
        ProductInterestFormComponent
      ],
      providers: [
        { provide: AccountingService, useValue: jasmine.createSpyObj('accountingService', ['findAccount', 'fetchAccounts']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(TestComponent);

    component = fixture.componentInstance;
  });

  it('should return same interest form data', () => {
    component.formData = validFormData;
    fixture.detectChanges();
    expect(component.form.formData).toEqual(component.formData);
  });

  it('should mark form as valid when range is valid', () => {
    component.formData = validFormData;
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
  });

  it('should mark form as invalid when range is invalid', () => {
    component.formData = invalidFormData;
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

});

@Component({
  template: '<fims-product-interests-form #form [formData]="formData"></fims-product-interests-form>'
})
class TestComponent {

  @ViewChild('form') form: ProductInterestFormComponent;

  formData: InterestFormData;
}
