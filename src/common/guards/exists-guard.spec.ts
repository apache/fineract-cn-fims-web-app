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

import {Router} from '@angular/router';
import {ExistsGuardService} from './exists-guard';
import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';

describe('Test Exists Guard Service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExistsGuardService,
        {
          provide: Router,
          useValue: jasmine.createSpyObj('router', ['navigate'])
        },
        {
          provide: 'cacheExpiry',
          useValue: 5000
        }
      ]
    });
  });

  it('should return false when not within expiry', fakeAsync(() => {
    inject([ExistsGuardService], (existsGuardService: ExistsGuardService) => {

      let result = true;

      existsGuardService.isWithinExpiry(Observable.of(Date.now() - 6000)).subscribe(isExpired => result = isExpired);

      tick();

      expect(result).toBeFalsy();
    })();
  }));

  it('should return true when within expiry', fakeAsync(() => {
    inject([ExistsGuardService], (existsGuardService: ExistsGuardService) => {

      let result = false;

      existsGuardService.isWithinExpiry(Observable.of(Date.now() - 1000)).subscribe(isExpired => result = isExpired);

      tick();

      expect(result).toBeTruthy();
    })();
  }));

  it('should route to /404 on exception and return false', fakeAsync(() => {
    inject([ExistsGuardService, Router], (existsGuardService: ExistsGuardService, router: Router) => {

      let result = true;

      existsGuardService.routeTo404OnError(Observable.throw({})).subscribe(canActivate => result = canActivate);

      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/404']);

      expect(result).toBeFalsy();
    })();
  }));

});
