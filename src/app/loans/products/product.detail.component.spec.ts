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
import {ProductDetailComponent} from './product.detail.component';
import {ActivatedRouteStub, RouterLinkStubDirective} from '../../common/testing/router-stubs';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {PortfolioStore} from './store/index';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {TdDialogService} from '@covalent/core';
import {FimsProduct} from './store/model/fims-product.model';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';
import * as fromPortfolio from './store';
import * as fromRoot from '../../store';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {FimsPermissionStubDirective} from '../../common/testing/permission-stubs';
import {MatDialogModule} from '@angular/material';

describe('Test product list component', () => {

  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(() => {
    const activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatDialogModule
      ],
      declarations: [
        FimsPermissionStubDirective,
        RouterLinkStubDirective,
        ProductDetailComponent
      ],
      providers: [
        TdDialogService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: PortfolioStore, useValue: jasmine.createSpyObj('portfolioStore', ['select', 'dispatch']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(ProductDetailComponent);

    component = fixture.componentInstance;
  });

  function setup(enabled: boolean, hasChangePermission: boolean) {
    const product: FimsProduct = {
      identifier: 'test',
      name: 'test',
      termRange: { temporalUnit: 'MONTHS', maximum: 1 },
      balanceRange: { minimum: 1, maximum: 2 },
      interestRange: { minimum: 1, maximum: 2 },
      interestBasis: 'BEGINNING_BALANCE',
      patternPackage: 'test',
      description: '',
      accountAssignments: [],
      parameters: {
        moratoriums: [],
        minimumDispersalAmount: 0,
        maximumDispersalAmount: 1,
        maximumDispersalCount: 1
      },
      currencyCode: 'USD',
      minorCurrencyUnitDigits: 1,
      enabled
    };

    const permissions: FimsPermission[] = [];

    if (hasChangePermission) {
      permissions.push({
        id: 'portfolio_products',
        accessLevel: 'CHANGE'
      });
    }

    const portfolioStore = TestBed.get(PortfolioStore);

    portfolioStore.select.and.callFake(selector => {
      if (selector === fromPortfolio.getSelectedProduct) {
        return Observable.of(product);
      }
      if (selector === fromRoot.getPermissions) {
        return Observable.of(permissions);
      }
    });
  }

  function getCreateButton(): DebugElement {
    return fixture.debugElement.query(By.css('fims-fab-button'));
  }

  it('should display edit button when product is not enabled and has change permission', () => {
    setup(false, true);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).not.toBeNull();
  });

  it('should not display edit button when product is enabled and has no change permission', () => {
    setup(true, false);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).toBeNull();
  });

  it('should not display edit button when product is enabled and has change permission', () => {
    setup(true, true);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).toBeNull();
  });

});
