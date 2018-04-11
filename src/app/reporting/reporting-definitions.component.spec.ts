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
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportingService} from '../services/reporting/reporting.service';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {ReportingDefinitionsComponent} from './reporting-definitions.component';
import {ReportDefinition} from '../services/reporting/domain/report-definition.model';
import {ActivatedRouteStub} from '../common/testing/router-stubs';
import {FimsSharedModule} from '../common/common.module';
import {MatLine, MatListModule, MatToolbarModule} from '@angular/material';

const definitions: ReportDefinition[] = [
  { identifier: 'reportOne', name: '', description: '', displayableFields: [], queryParameters: [] },
  { identifier: 'reportTwo', name: '', description: '', displayableFields: [], queryParameters: [] }
];

describe('Test reporting definitions component', () => {

  let activatedRoute: ActivatedRouteStub;

  let fixture: ComponentFixture<ReportingDefinitionsComponent>;

  let testComponent: ReportingDefinitionsComponent;

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();

    activatedRoute.testParams = { category: 'categoryOne' };

    TestBed.configureTestingModule({
      declarations: [
        ReportingDefinitionsComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        MatToolbarModule,
        MatListModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate'])},
        {provide: ActivatedRoute, useValue: activatedRoute },
        {provide: ReportingService, useValue: jasmine.createSpyObj('reportingService', ['fetchReportDefinitions'])}
      ]
    });

    fixture = TestBed.createComponent(ReportingDefinitionsComponent);
    testComponent = fixture.componentInstance;

    const reportingService = TestBed.get(ReportingService);
    reportingService.fetchReportDefinitions.and.returnValue(Observable.of(definitions));

    fixture.detectChanges();
  });

  it('should render mat-list-items on the page', () => {
    const listItems = fixture.debugElement.queryAll(By.directive(MatLine));

    expect(listItems.length).toBe(2);
  });

  it('should navigate to report definitions page', inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
    const listItems = fixture.debugElement.queryAll(By.directive(MatLine));

    listItems[1].nativeElement.click();

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['reports', 'reportTwo'], { relativeTo: route });
  }));


  it('should call the service with the right param', inject([ReportingService], (service: ReportingService) => {
    expect(service.fetchReportDefinitions).toHaveBeenCalledWith('categoryOne');
  }));
});
