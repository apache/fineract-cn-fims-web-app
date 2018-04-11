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
import {CaseListComponent} from './case.list.component';
import {ActivatedRouteStub, RouterLinkStubDirective, RouterStub} from '../../common/testing/router-stubs';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import * as fromCases from './store/index';
import {CasesStore} from './store/index';
import * as fromCustomers from '../store';
import * as fromRoot from '../../store';
import {By} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {Customer} from '../../services/customer/domain/customer.model';
import {CustomerState} from '../../services/customer/domain/customer-state.model';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';

describe('Test case list component', () => {

  let component: CaseListComponent;
  let fixture: ComponentFixture<CaseListComponent>;

  beforeEach(() => {
    const activatedRoute = new ActivatedRouteStub();
    const routerStub = new RouterStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        RouterLinkStubDirective,
        CaseListComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerStub },
        { provide: CasesStore, useValue: jasmine.createSpyObj('casesStore', ['select', 'dispatch']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(CaseListComponent);

    component = fixture.componentInstance;
  });

  function setup(currentState: CustomerState, hasChangePermission: boolean) {
    const customer: Customer = {
      identifier: 'test',
      type: 'BUSINESS',
      givenName: 'test',
      surname: 'test',
      dateOfBirth: undefined,
      address: undefined,
      customValues: [],
      member: false,
      currentState
    };

    const permissions: FimsPermission[] = [];

    if (hasChangePermission) {
      permissions.push({
        id: 'portfolio_cases',
        accessLevel: 'CHANGE'
      });
    }

    const casesStore = TestBed.get(CasesStore);

    casesStore.select.and.callFake(selector => {
      if (selector === fromCases.getCaseSearchResults) {
        return Observable.of({});
      }
      if (selector === fromCustomers.getSelectedCustomer) {
        return Observable.of(customer);
      }
      if (selector === fromRoot.getPermissions) {
        return Observable.of(permissions);
      }
    });
  }

  function getCreateButton(): DebugElement {
    return fixture.debugElement.query(By.css('fims-fab-button'));
  }

  it('should not display add button when customer is not active but has change permission', () => {
    setup('PENDING', true);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).toBeNull();
  });

  it('should not display add button when customer is active but has no change permission', () => {
    setup('ACTIVE', false);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).toBeNull();
  });

  it('should display add button when customer is active and has change permission', () => {
    setup('ACTIVE', true);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).not.toBeNull();
  });

});
