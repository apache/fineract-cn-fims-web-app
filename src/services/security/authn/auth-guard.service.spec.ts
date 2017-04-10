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

import {AuthGuard} from './auth-guard.service';
import {Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {TestBed, inject} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app/reducers';

describe('Test Auth Guard Service', () => {

  let route: ActivatedRouteSnapshot;

  let state: RouterStateSnapshot;

  let router = {
    navigate(){}
  };

  describe('when logged in', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AuthGuard,
          { provide: Router, useValue: router},
          {
            provide: Store, useClass: class {
              select = jasmine.createSpy('select').and.callFake(selector => {
                if(selector === fromRoot.getAuthenticationLoading) return Observable.of(false);
                if(selector === fromRoot.getAuthentication) return Observable.of({});
              })
            }
          }
        ]
      });
    });

    it('should test if route is active', (done: DoneFn) => {
      inject([AuthGuard], (authGuard: AuthGuard) => {
        authGuard.canActivate(route, state).subscribe(canActivate => {
          expect(canActivate).toBeTruthy();
          done();
        });
      })()
    });
  });

  describe('when not logged in', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AuthGuard,
          { provide: Router, useValue: router},
          {
            provide: Store, useClass: class {
              select = jasmine.createSpy('select').and.callFake(selector => {
                if(selector === fromRoot.getAuthenticationLoading) return Observable.of(false);
                if(selector === fromRoot.getAuthentication) return Observable.of(null);
              })
            }
          }
        ]
      });
    });

    it('should test if route gets deactivated when user is not logged in', (done: DoneFn) => {
      inject([AuthGuard], (authGuard: AuthGuard) => {
        authGuard.canActivate(route, state).subscribe(canActivate => {
          expect(canActivate).toBeFalsy();
          done();
        });
      })();
    });

    it('should test if guard redirects to login page when user is not logged in', (done: DoneFn) => {
      inject([AuthGuard, Router], (authGuard: AuthGuard, router: Router) => {
        spyOn(router, 'navigate');
        authGuard.canActivate(route, state).subscribe(canActivate => {
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      })()
    });
  });

});
