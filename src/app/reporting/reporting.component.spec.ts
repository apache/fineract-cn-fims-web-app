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
import {ReportingComponent} from './reporting.component';
import {TranslateModule} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportingService} from '../services/reporting/reporting.service';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {FimsSharedModule} from '../common/common.module';
import {RouterLinkStubDirective, RouterOutletStubComponent} from '../common/testing/router-stubs';
import {MatListModule, MatToolbarModule} from '@angular/material';

describe('Test reporting component', () => {

  const activatedRoute: ActivatedRoute = undefined;

  let fixture: ComponentFixture<ReportingComponent>;

  let testComponent: ReportingComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportingComponent,
        RouterLinkStubDirective,
        RouterOutletStubComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        MatListModule,
        MatToolbarModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate'])},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: ReportingService, useValue: jasmine.createSpyObj('reportingService', ['fetchCategories'])}
      ]
    });

    fixture = TestBed.createComponent(ReportingComponent);
    testComponent = fixture.componentInstance;

    const reportingService = TestBed.get(ReportingService);
    reportingService.fetchCategories.and.returnValue(Observable.of(['categoryOne', 'categoryTwo']));

    fixture.detectChanges();
  });

  it('should render mat-list-items on the page', () => {
    const listItems = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));

    expect(listItems.length).toBe(2);
  });

  it('should navigate to report definitions page', () => {
    const listItems = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));

    listItems[0].nativeElement.click();

    fixture.detectChanges();

    const linkDebugs = fixture.debugElement
      .queryAll(By.directive(RouterLinkStubDirective));

    const links = linkDebugs
      .map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);

    expect(links[0].navigatedTo).toEqual(['categories', 'categoryOne']);
  });

});
