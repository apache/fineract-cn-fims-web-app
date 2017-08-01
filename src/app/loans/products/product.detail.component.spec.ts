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
import {ProductDetailComponent} from './product.detail.component';
import {ActivatedRouteStub, RouterLinkStubDirective} from '../../common/testing/router-stubs';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {PortfolioStore} from './store/index';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {CovalentDialogsModule, TdDialogService} from '@covalent/core';
import {FimsProduct} from './store/model/fims-product.model';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';
import * as fromPortfolio from './store';
import * as fromRoot from '../../store';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {FimsPermissionStubDirective} from '../../common/testing/permission-stubs';
import {MdDialogModule} from '@angular/material';

describe('Test product list component', () => {

  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(() => {
    const activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MdDialogModule
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
      termRange: undefined,
      balanceRange: undefined,
      interestRange: undefined,
      interestBasis: undefined,
      patternPackage: 'test',
      description: '',
      accountAssignments: [],
      parameters: undefined,
      currencyCode: '',
      minorCurrencyUnitDigits: 1,
      enabled
    };

    const permissions: FimsPermission[] = [];

    if(hasChangePermission) {
      permissions.push({
        id: 'portfolio_products',
        accessLevel: 'CHANGE'
      })
    }

    const portfolioStore = TestBed.get(PortfolioStore);

    portfolioStore.select.and.callFake(selector => {
      if(selector === fromPortfolio.getSelectedProduct) return Observable.of(product);
      if(selector === fromRoot.getPermissions) return Observable.of(permissions);
    });
  }

  function getCreateButton(): DebugElement {
    return fixture.debugElement.query(By.css('fims-fab-button'));
  }

  xit('should not display add button when product is not enabled but has change permission', () => {
    // This test breaks with XMLHttpRequest cannot load ng:///DynamicTestModule/ProductDetailComponent.ngfactory.js
    setup(false, true);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).toBeNull();
  });

  xit('should not display add button when product is enabled but has no change permission', () => {
    // This test breaks with XMLHttpRequest cannot load ng:///DynamicTestModule/ProductDetailComponent.ngfactory.js
    setup(false, false);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).toBeNull();
  });

  xit('should display add button when product is enabled and has change permission', () => {
    // This test breaks with XMLHttpRequest cannot load ng:///DynamicTestModule/ProductDetailComponent.ngfactory.js
    setup(true, true);

    fixture.detectChanges();

    const button = getCreateButton();

    expect(button).not.toBeNull();
  })

});
