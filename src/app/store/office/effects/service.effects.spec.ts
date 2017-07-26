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
import {OfficeSearchApiEffects} from './service.effects';
import {Observable} from 'rxjs';
import {OfficeService} from '../../../../services/office/office.service';
import {SearchAction, SearchCompleteAction} from '../office.actions';
import {OfficePage} from '../../../../services/office/domain/office-page.model';
import {emptySearchResult} from '../../../../common/store/search.reducer';

describe('Office Search Api Effects', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        OfficeSearchApiEffects,
        {
          provide: OfficeService,
          useValue: jasmine.createSpyObj('officeService', ['listOffices'])
        }
      ]
    })

  });

  describe('search$', () => {

    function setup(params?: {searchOfficesReturnValue: any}) {
      const officeService = TestBed.get(OfficeService);
      if (params) {
        officeService.listOffices.and.returnValue(params.searchOfficesReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        officeEffects: TestBed.get(OfficeSearchApiEffects)
      };
    }

    it('should return a new SearchCompleteAction with EmployeePage', fakeAsync(() => {
      const officePage: OfficePage = {
        offices: [
          { identifier: '', name: '' }
        ],
        totalElements: 1,
        totalPages: 1
      };

      const { runner, officeEffects } = setup({ searchOfficesReturnValue: Observable.of(officePage) });

      const expectedResult = new SearchCompleteAction({
        elements: officePage.offices,
        totalPages: officePage.totalPages,
        totalElements: officePage.totalElements
      });

      runner.queue(new SearchAction({}));

      let result = null;
      officeEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new SearchCompleteAction, with an empty array, if office service throws', fakeAsync(() => {
      const {runner, officeEffects} = setup({searchOfficesReturnValue: Observable.throw(new Error())});

      const expectedResult = new SearchCompleteAction(emptySearchResult());

      runner.queue(new SearchAction({}));

      let result = null;
      officeEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));
  });
});
