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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { GroupSearchApiEffects } from './service.effects';
import { Observable } from 'rxjs/Observable';
import { GroupService } from '../../../services/group/group.service';
import { SearchAction, SearchCompleteAction } from '../group.actions';
import { GroupPage } from '../../../services/group/domain/group-page.model';
import { emptySearchResult } from '../../../common/store/search.reducer';

describe('Group Search Api Effects', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        GroupSearchApiEffects,
        {
          provide: GroupService,
          useValue: jasmine.createSpyObj('groupService', ['fetchGroups'])
        }
      ]
    });

  });

  describe('search$', () => {

    function setup(params?: { searchGroupsReturnValue: any }) {
      const groupService = TestBed.get(GroupService);
      if (params) {
        groupService.fetchGroups.and.returnValue(params.searchGroupsReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        groupEffects: TestBed.get(GroupSearchApiEffects)
      };
    }

    it('should return a new SearchCompleteAction with GroupPage', fakeAsync(() => {
      const groupPage: GroupPage = {
        groups: [
          {
            identifier: '', groupDefinitionIdentifier: '', name: '', leaders: [], members: [], office: '',
            assignedEmployee: '', weekday: 1, status: 'PENDING',
            address: { street: '', city: '', countryCode: '', country: '' }
          }],
        totalElements: 1,
        totalPages: 1
      };

      const { runner, groupEffects } = setup({ searchGroupsReturnValue: Observable.of(groupPage) });

      const expectedResult = new SearchCompleteAction({
        elements: groupPage.groups,
        totalPages: groupPage.totalPages,
        totalElements: groupPage.totalElements
      });

      runner.queue(new SearchAction({}));

      let result = null;
      groupEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new SearchCompleteAction, with an empty array, if group service throws', fakeAsync(() => {
      const { runner, groupEffects } = setup({ searchGroupsReturnValue: Observable.throw(new Error()) });

      const expectedResult = new SearchCompleteAction(emptySearchResult());

      runner.queue(new SearchAction({}));

      let result = null;
      groupEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));
  });
});
