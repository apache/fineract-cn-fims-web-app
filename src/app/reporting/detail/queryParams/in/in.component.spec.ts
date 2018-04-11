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
import {CovalentChipsModule} from '@covalent/core';
import {ReportingInParamComponent} from './in.component';
import {Component, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';

describe('Test in component', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CovalentChipsModule,
        NoopAnimationsModule
      ],
      declarations: [
        TestComponent,
        ReportingInParamComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set comma separated list', () => {
    testComponent.paramComponent.formControl.setValue(['test1', 'test2']);

    fixture.detectChanges();

    expect(testComponent.formControl.value).toEqual('test1,test2');
  });

  it('should mark control as valid when value available', () => {
    testComponent.paramComponent.formControl.setValue(['test1']);

    fixture.detectChanges();

    expect(testComponent.formControl.valid).toBeTruthy();
  });

  it('should mark control as invalid when no value available', () => {
    testComponent.paramComponent.formControl.setValue([]);

    fixture.detectChanges();

    expect(testComponent.formControl.invalid).toBeTruthy();
  });

});

@Component({
  template: '<fims-reporting-in-param #paramComponent [formControl]="formControl" [required]="true"></fims-reporting-in-param>'
})
class TestComponent {

  @ViewChild('paramComponent') paramComponent: ReportingInParamComponent;

  formControl: FormControl = new FormControl();
}
