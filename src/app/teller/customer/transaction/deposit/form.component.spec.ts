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
import {FimsSharedModule} from '../../../../common/common.module';
import {CovalentDataTableModule, CovalentStepsModule} from '@covalent/core';
import {MdButtonModule, MdCheckboxModule, MdInputModule, MdOptionModule, MdSelectModule} from '@angular/material';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {TellerTransactionFormComponent} from './form.component';
import {By} from '@angular/platform-browser';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setValueByFormControlName} from '../../../../common/testing/input-fields';
import {TransactionCostComponent} from '../components/cost.component';
import {clickOption} from '../../../../common/testing/select-fields';

describe('Test transaction form', () => {

  const productInstances: ProductInstance[] = [{
    customerIdentifier: 'test',
    accountIdentifier: 'test',
    productIdentifier: '',
    balance: 500
  }];

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        FimsSharedModule,
        FormsModule,
        ReactiveFormsModule,
        MdInputModule,
        MdButtonModule,
        MdSelectModule,
        MdOptionModule,
        MdCheckboxModule,
        CovalentStepsModule,
        CovalentDataTableModule
      ],
      providers: [
        {
          provide: AccountingService,
          useValue: jasmine.createSpyObj('accountingService', ['findAccount'])
        }
      ],
      declarations: [
        TransactionCostComponent,
        TellerTransactionFormComponent,
        TestComponent
      ]
    });

  });

  function setup(cashdrawLimit: number): any {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    component.productInstances = productInstances;
    component.cashdrawLimit = cashdrawLimit;

    fixture.detectChanges();
  }

  function transactionButton(): DebugElement {
    const element = fixture.debugElement.query(By.css('td-steps > div:nth-child(1) > td-step-body > div > div.td-step-body > div > div.td-step-actions > button.mat-raised-button.mat-primary'));
    return element;
  }

  function setAmount(value: string): void {
    setValueByFormControlName(fixture, 'amount', value);
  }

  it('test if create transaction is enabled when amount matches balance limit', () => {
    setup(1000);

    clickOption(fixture, 0);

    const productInstance = component.form.form.get('productInstance').value;

    expect(productInstance).toEqual(productInstances[0]);

    setAmount('500');

    const button: DebugElement = transactionButton();

    expect(button.properties['disabled']).toBeFalsy('Button should be enabled');
  });

  describe('test if create transaction is disabled', () => {

    beforeEach(() => {
      setup(1000);

      clickOption(fixture, 0);
    });

    it('when amount exeeds balance', () => {
      const productInstance = component.form.form.get('productInstance').value;

      expect(productInstance).toEqual(productInstances[0]);

      setAmount('501');

      const button: DebugElement = transactionButton();

      expect(button.properties['disabled']).toBeTruthy('Button should be disabled');
    });

    it('when amount exeeds withdrawal limit', () => {
      const productInstance = component.form.form.get('productInstance').value;

      expect(productInstance).toEqual(productInstances[0]);

      setAmount('1001');

      const button: DebugElement = transactionButton();

      expect(button.properties['disabled']).toBeTruthy('Button should be disabled');
    });

    it('when no amount is given', () => {
      const productInstance = component.form.form.get('productInstance').value;

      expect(productInstance).toEqual(productInstances[0]);

      const button: DebugElement = transactionButton();

      expect(button.properties['disabled']).toBeTruthy('Button should be disabled');
    });
  })
});

@Component({
  template: `<fims-teller-transaction-form #form
                                           [productInstances]="productInstances" 
                                           [cashdrawLimit]="cashdrawLimit" 
                                           [transactionType]="transactionType">
            </fims-teller-transaction-form>`
})
class TestComponent {

  productInstances: ProductInstance[];

  cashdrawLimit: number = 1000;

  transactionType: string = 'ACCC';

  @ViewChild('form') form: TellerTransactionFormComponent;

}
