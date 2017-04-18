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
import {SecurityApiEffects} from './service.effects';
import {Observable} from 'rxjs';
import {IdentityService} from '../../../../services/identity/identity.service';
import {AuthenticationService} from '../../../../services/security/authn/authentication.service';
import {Authentication} from '../../../../services/identity/domain/authentication.model';
import {
  ChangePasswordAction, ChangePasswordSuccessAction,
  LoginAction, LoginSuccessAction, LogoutAction, LogoutSuccessAction, PermissionUpdateSuccessAction,
  RefreshAccessTokenAction, RefreshAccessTokenStartTimerAction,
  RefreshAccessTokenSuccessAction,
  RefreshTokenStartTimerAction
} from '../security.actions';
import {PermittableGroupIdMapper} from '../../../../services/security/authz/permittable-group-id-mapper';
import {Store} from '@ngrx/store';
import {FimsPermission} from '../../../../services/security/authz/fims-permission.model';
import {Permission} from '../../../../services/identity/domain/permission.model';
import {IdentityPermittableGroupIds} from '../../../../services/identity/domain/permittable-group-ids.model';
import {mockAuthentication} from '../testing/authentication.mock';

describe('Security Api Effects', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        SecurityApiEffects,
        PermittableGroupIdMapper,
        { provide: 'tenantId', useValue: 'test' },
        { provide: 'tokenExpiryBuffer', useValue: 5000 },
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['select'])
        },
        {
          provide: AuthenticationService,
          useValue: jasmine.createSpyObj('authenticationService', ['login', 'getUserPermissions', 'logout', 'refreshAccessToken'])
        },
        {
          provide: IdentityService,
          useValue: jasmine.createSpyObj('identityService', ['changePassword'])
        }
      ]
    })

  });

  describe('login$', () => {

    function setup(params?: {loginReturnValue: any}) {
      const authenticationService = TestBed.get(AuthenticationService);
      if (params) {
        authenticationService.login.and.returnValue(params.loginReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return a new LoginSuccessAction with Authentication', fakeAsync(() => {
      const authentication = mockAuthentication();

      const { runner, securityEffects } = setup({ loginReturnValue: Observable.of(authentication) });

      const expectedResult = new LoginSuccessAction({
        username: 'test',
        tenant: 'test',
        authentication
      });

      runner.queue(new LoginAction({
        tenant: 'test',
        username: 'test',
        password: ''
      }));

      let result = null;
      securityEffects.login$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }));

  });

  describe('loadPermissions$', () => {

    function setup(params?: {loadPermissionReturnValue: any}) {
      const authenticationService = TestBed.get(AuthenticationService);
      if (params) {
        authenticationService.getUserPermissions.and.returnValue(params.loadPermissionReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return a new PermissionUpdateSuccessAction with FimsPermissions', fakeAsync(() => {
      const authentication = mockAuthentication();

      const identityPermissions: Permission[] = [
        { permittableEndpointGroupIdentifier: IdentityPermittableGroupIds.SELF_MANAGEMENT, allowedOperations: ['CHANGE']}
      ];

      const fimsPermissions: FimsPermission[] = [
        { id: 'identity_self', accessLevel: 'CHANGE' }
      ];

      const { runner, securityEffects } = setup({ loadPermissionReturnValue: Observable.of(identityPermissions) });

      const expectedResult = new PermissionUpdateSuccessAction(fimsPermissions);

      runner.queue(new LoginSuccessAction({
        tenant: 'test',
        username: 'test',
        authentication
      }));

      let result = null;
      securityEffects.loadPermissions$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }));

  });

  describe('startRefreshTokenTimer$', () => {

    function setup() {

      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects),
        tokenExpiryBuffer: TestBed.get('tokenExpiryBuffer')
      };
    }

    it('should start refresh token timer up on LoginSuccessAction', fakeAsync(() => {
      const { runner, securityEffects, tokenExpiryBuffer } = setup();

      const authentication = mockAuthentication();

      const refreshTokenMillies = new Date(authentication.refreshTokenExpiration).getTime();

      const expectedResult = new RefreshTokenStartTimerAction(new Date(refreshTokenMillies - tokenExpiryBuffer));

      runner.queue(new LoginSuccessAction({
        tenant: 'test',
        username: 'test',
        authentication
      }));

      let result = null;
      securityEffects.startRefreshTokenTimer$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('logout$', () => {

    function setup(params? : { logoutReturnValue: any }) {
      const authenticationService = TestBed.get(AuthenticationService);

      if (params) {
        authenticationService.logout.and.returnValue(params.logoutReturnValue);
      }

      const store = TestBed.get(Store);
      store.select.and.returnValue(Observable.of({
        username: 'test',
        tenant: 'test',
        authentication: mockAuthentication()
      }));

      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return a new LogoutSuccessAction when logout successful', fakeAsync(() => {
      const { runner, securityEffects } = setup({ logoutReturnValue: Observable.of({}) });

      const expectedResult = new LogoutSuccessAction();

      runner.queue(new LogoutAction());

      let result = null;
      securityEffects.logout$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }));

    it('should return a new LogoutSuccessAction when logout not successful', fakeAsync(() => {
      const { runner, securityEffects } = setup({ logoutReturnValue: Observable.throw(new Error()) });

      const expectedResult = new LogoutSuccessAction();

      runner.queue(new LogoutAction());

      let result = null;
      securityEffects.logout$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('refreshToken$', () => {
    function setup(params? : { refreshAccessTokenReturnValue: any }) {
      const authenticationService = TestBed.get(AuthenticationService);

      if (params) {
        authenticationService.refreshAccessToken.and.returnValue(params.refreshAccessTokenReturnValue);
      }

      const store = TestBed.get(Store);
      store.select.and.returnValue(Observable.of({
        username: 'test',
        tenant: 'test',
        authentication: mockAuthentication()
      }));

      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return new RefreshTokenSuccessAction when successful', fakeAsync(() => {
      const authentication = mockAuthentication();

      const { runner, securityEffects } = setup({ refreshAccessTokenReturnValue: Observable.of(authentication) });


      const expectedResult = new RefreshAccessTokenSuccessAction(authentication);

      runner.queue(new RefreshAccessTokenAction());

      let result = null;
      securityEffects.refreshToken$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('startAccessTokenRefreshTimerAfterRefresh$', () => {
    function setup() {
      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects),
        tokenExpiryBuffer: TestBed.get('tokenExpiryBuffer')
      };
    }

    it('should return new RefreshAccessTokenStartTimerAction', fakeAsync(() => {
      const authentication = mockAuthentication();

      const { runner, securityEffects, tokenExpiryBuffer } = setup();

      const accessTokenMillies = new Date(authentication.accessTokenExpiration).getTime();

      const expectedResult = new RefreshAccessTokenStartTimerAction(new Date(accessTokenMillies - tokenExpiryBuffer));

      runner.queue(new RefreshAccessTokenSuccessAction(authentication));

      let result = null;
      securityEffects.startAccessTokenRefreshTimerAfterRefresh$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('startAccessTokenRefreshTimerAfterLogin$', () => {
    function setup() {
      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects),
        tokenExpiryBuffer: TestBed.get('tokenExpiryBuffer')
      };
    }

    it('should return new RefreshAccessTokenStartTimerAction', fakeAsync(() => {
      const authentication = mockAuthentication();

      const { runner, securityEffects, tokenExpiryBuffer } = setup();

      const accessTokenMillies = new Date(authentication.accessTokenExpiration).getTime();

      const expectedResult = new RefreshAccessTokenStartTimerAction(new Date(accessTokenMillies - tokenExpiryBuffer));

      runner.queue(new LoginSuccessAction({
        tenant: 'test',
        username: 'test',
        authentication
      }));

      let result = null;
      securityEffects.startAccessTokenRefreshTimerAfterLogin$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('refreshAccessTokenStartTimer$', () => {
    function setup() {
      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return new RefreshAccessTokenAction when time is due', fakeAsync(() => {
      const { runner, securityEffects } = setup();

      const dueDate = new Date(Date.now() + 500);

      const expectedResult = new RefreshAccessTokenAction();

      runner.queue(new RefreshAccessTokenStartTimerAction(dueDate));

      let result = null;
      securityEffects.refreshAccessTokenStartTimer$.subscribe(_result => result = _result);

      tick();

      expect(result).toBe(null);

      tick(500);
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('refreshTokenStartTimer$', () => {

    function setup() {
      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return new LogoutAction when time is due', fakeAsync(() => {
      const { runner, securityEffects } = setup();

      const dueDate = new Date(Date.now() + 500);

      const expectedResult = new LogoutAction();

      runner.queue(new RefreshTokenStartTimerAction(dueDate));

      let result = null;
      securityEffects.refreshTokenStartTimer$.subscribe(_result => result = _result);

      tick();

      expect(result).toBe(null);

      tick(500);
      expect(result).toEqual(expectedResult);
    }))
  });

  describe('changePassword$', () => {

    function setup(params?: { changePasswordReturnValue: any }) {
      const identityService = TestBed.get(IdentityService);
      if(params){
        identityService.changePassword.and.returnValue(params.changePasswordReturnValue);
      }

      return {
        runner: TestBed.get(EffectsRunner),
        securityEffects: TestBed.get(SecurityApiEffects)
      };
    }

    it('should return new ChangePasswordSuccessAction when password is changed successfully', fakeAsync(() => {
      const { runner, securityEffects } = setup({ changePasswordReturnValue: Observable.of({})});

      const expectedResult = new ChangePasswordSuccessAction();

      runner.queue(new ChangePasswordAction({
        username: '',
        password: ''
      }));

      let result = null;
      securityEffects.changePassword$.subscribe(_result => result = _result);

      tick();
      expect(result).toEqual(expectedResult);
    }))
  });
});
