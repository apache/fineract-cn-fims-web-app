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
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReportingBetweenParamComponent} from './between.component';
import {Component, ViewChild} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MatInputModule} from '@angular/material';

describe('Test between component', () => {

  let fixture: ComponentFixture<DateTestComponent>;

  let testComponent: DateTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      declarations: [
        DateTestComponent,
        ReportingBetweenParamComponent
      ]
    });

    fixture = TestBed.createComponent(DateTestComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should return same value', () => {
    const value = '2017-01-01..2017-01-01';

    testComponent.formControl.setValue(value);

    fixture.detectChanges();

    expect(testComponent.formControl.value).toEqual(value);
  });

  it('should mark control as valid when valid range', () => {
    const start = '2017-01-01';
    const end = '2017-01-01';

    testComponent.formControl.setValue(`${start}..${end}`);

    fixture.detectChanges();

    expect(testComponent.formControl.valid).toBeTruthy();
  });

  it('should mark control as invalid when invalid range', () => {
    const start = '2017-01-02';
    const end = '2017-01-01';

    testComponent.formControl.setValue(`${start}..${end}`);

    fixture.detectChanges();

    expect(testComponent.formControl.invalid).toBeTruthy();
  });

});

@Component({
  template: `
    <fims-reporting-between-param #paramComponent [formControl]="formControl" [required]="true" type="DATE">
    </fims-reporting-between-param>`
})
class DateTestComponent {

  @ViewChild('paramComponent') paramComponent: ReportingBetweenParamComponent;

  formControl: FormControl = new FormControl();
}
