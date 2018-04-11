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
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IdentityCardFormComponent} from './identity-card-form.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatInputModule} from '@angular/material';
import {CovalentFileModule, CovalentStepsModule} from '@covalent/core';
import {ReactiveFormsModule} from '@angular/forms';
import {setValueByCssSelector} from '../../../../common/testing/input-fields';
import {By} from '@angular/platform-browser';
import {Component, DebugElement} from '@angular/core';
import {IdentificationCard} from '../../../../services/customer/domain/identification-card.model';
import {TranslateModule} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {dateAsISOString, toFimsDate} from '../../../../services/domain/date.converter';
import {FimsSharedModule} from '../../../../common/common.module';

describe('Test identity card form component', () => {

  let fixture: ComponentFixture<TestComponent>;

  let formComponent: TestComponent;

  let oneDayAhead: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        IdentityCardFormComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        CovalentStepsModule,
        CovalentFileModule,
        NoopAnimationsModule
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    formComponent = fixture.componentInstance;

    fixture.detectChanges();
  }));

  beforeEach(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    oneDayAhead = dateAsISOString(today);
  });

  function setValidValues(): void {
    setValueByCssSelector(fixture, '#number', 'test');
    setValueByCssSelector(fixture, '#type', 'test');
    setValueByCssSelector(fixture, '#expirationDate', oneDayAhead);
    setValueByCssSelector(fixture, '#issuer', 'test');
  }

  it('should disable/enable save button', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button[color="primary"]'));

    expect(button.properties['disabled']).toBeTruthy('Button should be disabled');

    setValidValues();

    fixture.detectChanges();

    expect(button.properties['disabled']).toBeFalsy('Button should be enabled');
  });

  it('should set the correct form values', () => {
    setValidValues();

    fixture.detectChanges();

    const button: DebugElement = fixture.debugElement.query(By.css('button[color="primary"]'));

    button.nativeElement.click();

    const expectedResult: IdentificationCard = {
      type: 'test',
      issuer: 'test',
      expirationDate: toFimsDate(oneDayAhead),
      number: 'test'
    };

    fixture.detectChanges();

    expect(expectedResult).toEqual(fixture.componentInstance.output);
  });

});

@Component({
  template: '<fims-identity-card-form [identificationCard]="input" (onSave)="onSave($event)"></fims-identity-card-form>'
})
class TestComponent {

  input: IdentificationCard = {
    type: '',
    number: '',
    expirationDate: null
  };

  output: IdentificationCard;

  onSave(identificationCard: IdentificationCard): void {
    this.output = identificationCard;
  }
}
