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
import {Component, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CaseDetailFormComponent, DetailFormData} from './detail.component';
import {FimsSharedModule} from '../../../../common/common.module';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {MatInputModule, MatOptionModule, MatRadioModule, MatSelectModule, MatTooltipModule} from '@angular/material';

describe('Test case detail form component', () => {

  const products: Product[] = [
    {
      identifier: 'productIdentifier',
      name: 'product',
      termRange: {
        temporalUnit: 'WEEKS',
        maximum: 2
      },
      balanceRange: {
        minimum: 1,
        maximum: 2
      },
      interestRange: {
        minimum: 1,
        maximum: 2
      },
      interestBasis: 'CURRENT_BALANCE',
      patternPackage: '',
      description: '',
      accountAssignments: [],
      parameters: null,
      currencyCode: '',
      minorCurrencyUnitDigits: 2
    }
  ];

  const productInstances: ProductInstance[] = [
    {
      customerIdentifier: 'customerIdentifier',
      accountIdentifier: 'depositAccountIdentifier',
      productIdentifier: 'productIdentifier'
    }
  ];

  const validFormData: DetailFormData = {
    identifier: 'identifier',
    productIdentifier: 'productIdentifier',
    interest: '1.00',
    principalAmount: '1.00',
    term: 1,
    termTemporalUnit: 'WEEKS',
    paymentTemporalUnit: 'WEEKS',
    paymentPeriod: 1,
    paymentAlignmentDay: 1,
    paymentAlignmentWeek: undefined,
    paymentAlignmentMonth: undefined,
    depositAccountIdentifier: 'depositAccountIdentifier'
  };

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatRadioModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatTooltipModule,
        FimsSharedModule,
        NoopAnimationsModule
      ],
      declarations: [
        TestComponent,
        CaseDetailFormComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);

    component = fixture.componentInstance;

    component.products = products;
    component.productInstances = productInstances;
  });

  it('should return same form data', () => {
    component.formData = validFormData;
    fixture.detectChanges();
    expect(component.form.formData).toEqual(component.formData);
  });

  it('should mark form as valid', () => {
    component.formData = validFormData;
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
  });

  it('should mark form as invalid when principal amount is invalid', () => {
    component.formData = Object.assign({}, validFormData, {
      principalAmount: '3'
    });
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

  it('should mark form as invalid when interest is invalid', () => {
    component.formData = Object.assign({}, validFormData, {
      interest: '3'
    });
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

  it('should mark form as invalid when term range is invalid', () => {
    component.formData = Object.assign({}, validFormData, {
      term: 3
    });
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

  describe('weeks selection', () => {
    it('should mark form as invalid when no week day is given', () => {
      component.formData = Object.assign({}, validFormData, {
        paymentTemporalUnit: 'WEEKS',
        paymentAlignmentDay: undefined
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });
  });

  describe('months selection', () => {
    it('should mark form as invalid when no week day is given on DAY', () => {
      component.formData = Object.assign({}, validFormData, {
        paymentTemporalUnit: 'MONTHS',
        paymentAlignmentDay: undefined,
        paymentAlignmentWeek: undefined,
        paymentAlignmentMonth: undefined
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });

    it('should mark form as invalid when no week day is given on WEEK_AND_DAY', () => {
      component.formData = Object.assign({}, validFormData, {
        paymentTemporalUnit: 'MONTHS',
        paymentAlignmentDay: undefined,
        paymentAlignmentWeek: 1,
        paymentAlignmentMonth: undefined
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });

  });

  describe('years selection', () => {
    it('should mark form as invalid when no month is given', () => {
      component.formData = Object.assign({}, validFormData, {
        paymentTemporalUnit: 'YEARS',
        paymentAlignmentDay: 1,
        paymentAlignmentWeek: 1,
        paymentAlignmentMonth: undefined,
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });
  });

});

@Component({
  template: `
    <fims-case-detail-form #form [formData]="formData" [products]="products" [productInstances]="productInstances">
    </fims-case-detail-form>`
})
class TestComponent {

  @ViewChild('form') form: CaseDetailFormComponent;

  formData: DetailFormData;

  products: Product[];

  productInstances: ProductInstance[];
}
