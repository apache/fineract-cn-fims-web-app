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
import {RoleSearchApiEffects} from './service.effects';
import {Observable} from 'rxjs';
import {IdentityService} from '../../../../services/identity/identity.service';
import {Role} from '../../../../services/identity/domain/role.model';
import {SearchAction, SearchCompleteAction} from '../role.actions';
import {emptySearchResult} from '../../../../common/store/search.reducer';

describe('Role Search Api Effects', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        RoleSearchApiEffects,
        {
          provide: IdentityService,
          useValue: jasmine.createSpyObj('identityService', ['listRoles'])
        }
      ]
    })

  });

  describe('search$', () => {

    function setup(params?: {searchRolesReturnValue: any}) {
      const identityService = TestBed.get(IdentityService);
      if (params) {
        identityService.listRoles.and.returnValue(params.searchRolesReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        roleEffects: TestBed.get(RoleSearchApiEffects)
      };
    }

    it('should return a new SearchCompleteAction with Roles', fakeAsync(() => {
      const roles: Role[] = [
        { identifier: '', permissions: []}
      ];

      const { runner, roleEffects } = setup({ searchRolesReturnValue: Observable.of(roles) });

      const expectedResult = new SearchCompleteAction({
        elements: roles,
        totalPages: 1,
        totalElements: roles.length
      });

      runner.queue(new SearchAction());

      let result = null;
      roleEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new SearchCompleteAction, with empty search result, if identity service throws', fakeAsync(() => {
      const {runner, roleEffects} = setup({searchRolesReturnValue: Observable.throw(new Error())});

      const expectedResult = new SearchCompleteAction(emptySearchResult());

      runner.queue(new SearchAction());

      let result = null;
      roleEffects.search$.subscribe(_result => result = _result);

      tick(299);
      expect(result).toBe(null);
      tick(300);
      expect(result).toEqual(expectedResult);
    }));
  });
});
