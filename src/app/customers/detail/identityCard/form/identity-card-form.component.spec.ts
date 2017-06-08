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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IdentityCardFormComponent} from './identity-card-form.component';
import {MdInputModule} from '@angular/material';
import {CovalentStepsModule} from '@covalent/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFinalActionComponent} from '../../../../../common/forms/form-final-action.component';
import {IdInputComponent} from '../../../../../common/id-input/id-input.component';
import {setValueByCssSelector, setValueByFormControlName} from '../../../../../common/testing/input-fields';
import {By} from '@angular/platform-browser';
import {Component, DebugElement} from '@angular/core';
import {IdentificationCard} from '../../../../../services/customer/domain/identification-card.model';
import {TranslateModule} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('Test identity card form component', () => {

  let fixture: ComponentFixture<TestComponent>;

  let formComponent: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        IdInputComponent,
        FormFinalActionComponent,
        IdentityCardFormComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MdInputModule,
        CovalentStepsModule,
        NoopAnimationsModule
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    formComponent = fixture.componentInstance;
  }));

  function setValidValues(): void {
    setValueByCssSelector(fixture, 'input[placeholder="Number"]', 'test');
    setValueByFormControlName(fixture, 'type', 'test');
    setValueByFormControlName(fixture, 'expirationDate', '2012-01-02');
    setValueByFormControlName(fixture, 'issuer', 'test');
  }

  it('should disable/enable login button', () => {
    fixture.detectChanges();

    let button: DebugElement = fixture.debugElement.query(By.css('button'));

    expect(button.properties['disabled']).toBeTruthy('Button should be disabled');

    setValidValues();

    fixture.detectChanges();

    expect(button.properties['disabled']).toBeFalsy('Button should be enabled');
  });

  it('should set the correct form values', () => {
    fixture.detectChanges();

    setValidValues();

    fixture.detectChanges();

    const button: DebugElement = fixture.debugElement.query(By.css('button[color="primary"]'));

    button.nativeElement.click();

    const expectedResult: IdentificationCard = {
      type: 'test',
      issuer: 'test',
      expirationDate: {
        day: 2,
        month: 1,
        year: 2012
      },
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
