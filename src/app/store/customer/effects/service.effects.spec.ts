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

import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {EffectsRunner, EffectsTestingModule} from '@ngrx/effects/testing';
import {CustomerSearchApiEffects} from './service.effects';
import {Observable} from 'rxjs';
import {CustomerService} from '../../../../services/customer/customer.service';
import {SearchAction, SearchCompleteAction} from '../customer.actions';
import {CustomerPage} from '../../../../services/customer/domain/customer-page.model';
import {emptySearchResult} from '../../../../common/store/search.reducer';

describe('Customer Search Api Effects', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        CustomerSearchApiEffects,
        {
          provide: CustomerService,
          useValue: jasmine.createSpyObj('customerService', ['fetchCustomers'])
        }
      ]
    })

  });

  describe('search$', () => {

    function setup(params?: {searchCustomersReturnValue: any}) {
      const customerService = TestBed.get(CustomerService);
      if (params) {
        customerService.fetchCustomers.and.returnValue(params.searchCustomersReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        customerEffects: TestBed.get(CustomerSearchApiEffects)
      };
    }

    it('should return a new SearchCompleteAction with CustomerPage', fakeAsync(() => {
      const customerPage: CustomerPage = {
        customers: [
          { identifier: 'test', type: 'PERSON', givenName: '', surname: '', dateOfBirth: {}, member: true, address: {
            street: '', city: '', countryCode: '', country: ''
          }, customValues: [] }
        ],
        totalElements: 1,
        totalPages: 1
      };

      const { runner, customerEffects } = setup({ searchCustomersReturnValue: Observable.of(customerPage) });

      const expectedResult = new SearchCompleteAction({
        elements: customerPage.customers,
        totalPages: customerPage.totalPages,
        totalElements: customerPage.totalElements
      });

      runner.queue(new SearchAction({}));

      let result = null;
      customerEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new SearchCompleteAction, with an empty array, if customer service throws', fakeAsync(() => {
      const {runner, customerEffects} = setup({searchCustomersReturnValue: Observable.throw(new Error())});

      const expectedResult = new SearchCompleteAction(emptySearchResult());

      runner.queue(new SearchAction({}));

      let result = null;
      customerEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));
  });
});
