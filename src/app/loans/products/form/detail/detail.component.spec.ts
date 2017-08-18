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
import {TranslateModule} from '@ngx-translate/core';
import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DetailFormData, ProductDetailFormComponent} from './detail.component';
import {MdInputModule, MdRadioModule, MdSelectModule} from '@angular/material';
import {FimsSharedModule} from '../../../../common/common.module';

describe('Test product detail component', () => {

  const validFormData: DetailFormData = {
    identifier: 'test',
    minimumBalance: '1000',
    maximumBalance: '2000',
    temporalUnit: 'WEEKS',
    description: 'description',
    currencyCode: 'USD',
    name: 'test',
    term: 12
  };

  const invalidFormData: DetailFormData = {
    identifier: 'test',
    minimumBalance: '2000',
    maximumBalance: '1000',
    temporalUnit: 'WEEKS',
    description: 'description',
    currencyCode: 'USD',
    name: 'test',
    term: 12
  };

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MdRadioModule,
        MdInputModule,
        MdSelectModule,
        FimsSharedModule,
        NoopAnimationsModule
      ],
      declarations: [
        TestComponent,
        ProductDetailFormComponent
      ]
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
  template: '<fims-product-detail-form #form [formData]="formData"></fims-product-detail-form>'
})
class TestComponent {

  @ViewChild('form') form: ProductDetailFormComponent;

  formData: DetailFormData;
}
