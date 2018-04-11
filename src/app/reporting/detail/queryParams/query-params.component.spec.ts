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
import {By} from '@angular/platform-browser';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReportingQueryParamsComponent} from './query-params.component';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {QueryParameter} from '../../../services/reporting/domain/query-parameter.model';
import {FimsSharedModule} from '../../../common/common.module';

describe('Test reporting query params component', () => {

  let fixture: ComponentFixture<ReportingQueryParamsComponent>;

  let testComponent: ReportingQueryParamsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportingQueryParamsComponent,
        TestComponent
      ],
      imports: [
        FimsSharedModule,
        NoopAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ReportingQueryParamsComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  xit('should render fims-reporting-query-param on the page', () => {
    const listItems = fixture.debugElement.queryAll(By.css('fims-reporting-query-param'));

    expect(listItems.length).toBe(2);
  });

});

@Component({
  template: '<fims-reporting-query-params #mandatoryComponent [queryParams]="queryParams"></fims-reporting-query-params>'
})
class TestComponent {
  queryParams: QueryParameter[] = [
    { name: 'testa', mandatory: true, type: 'TEXT', operator: 'EQUALS' },
    { name: 'testb', mandatory: true, type: 'TEXT', operator: 'EQUALS' }
  ];
}
