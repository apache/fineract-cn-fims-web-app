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

import {Injectable, Inject} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as securityActions from '../security.actions';
import {AuthenticationService} from '../../../../services/security/authn/authentication.service';
import {PermissionId} from '../../../../services/security/authz/permission-id.type';
import {FimsPermission} from '../../../../services/security/authz/fims-permission.model';
import {Permission} from '../../../../services/identity/domain/permission.model';
import {PermittableGroupIdMapper} from '../../../../services/security/authz/permittable-group-id-mapper';
import * as fromRoot from '../../index';
import {IdentityService} from '../../../../services/identity/identity.service';
import {Password} from '../../../../services/identity/domain/password.model';

@Injectable()
export class SecurityApiEffects {


  constructor(private actions$: Actions, private identityService: IdentityService, private authenticationService: AuthenticationService, private idMapper: PermittableGroupIdMapper,
              @Inject('tokenExpiryBuffer') private tokenExpiryBuffer: number,
              private store: Store<fromRoot.State>) {}

  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGIN)
    .map((action: securityActions.LoginAction) => action.payload)
    .mergeMap(payload =>
      this.authenticationService.login(payload.tenant, payload.username, payload.password)
        .map(authentication => Object.assign({}, {
          username: payload.username,
          tenant: payload.tenant,
          authentication: authentication
        }))
        .map(payload => new securityActions.LoginSuccessAction(payload))
        .catch((error) => of(new securityActions.LoginFailAction(error)))
    );

  @Effect()
  loadPermissions$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGIN_SUCCESS)
    .map((action: securityActions.LoginSuccessAction) => action.payload)
    .mergeMap(payload =>
      this.fetchPermissions(payload.tenant, payload.username, payload.authentication.accessToken)
        .map(permissions => new securityActions.PermissionUpdateSuccessAction(permissions))
        .catch(error => of(new securityActions.PermissionUpdateFailAction(error)))
    );

  @Effect()
  startRefreshTokenTimer$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGIN_SUCCESS)
    .map((action: securityActions.LoginSuccessAction) => action.payload)
    .map(payload => new Date(payload.authentication.refreshTokenExpiration).getTime())
    .map(refreshTokenExpirationMillies => new Date(refreshTokenExpirationMillies - this.tokenExpiryBuffer))
    .map(delay => new securityActions.RefreshTokenStartTimerAction(delay));

  private fetchPermissions(tenantId: string, username: string, accessToken: string): Observable<FimsPermission[]>{
    return this.authenticationService.getUserPermissions(tenantId, username, accessToken)
      .flatMap((permissions: Permission[]) => Observable.from(permissions))
      .map((permission: Permission) => this.mapPermissions(permission))
      .reduce((acc: FimsPermission[], permissions: FimsPermission[]) => acc.concat(permissions), []);
  }

  private mapPermissions(permission: Permission): FimsPermission[]{
    let result: FimsPermission[] = [];
    let descriptor = this.idMapper.map(permission.permittableEndpointGroupIdentifier);

    if(descriptor){
      let internalKey: PermissionId = descriptor.id;

      for(let operation of permission.allowedOperations){
        result.push({
          id: internalKey,
          accessLevel: operation
        })
      }
    }

    return result;
  }

  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGOUT)
    .mergeMap(() => this.store.select(fromRoot.getAuthenticationState).take(1))
    .mergeMap(state =>
      this.authenticationService.logout(state.tenant, state.username, state.authentication.accessToken)
        .map(() => new securityActions.LogoutSuccessAction())
        .catch((error) => of(new securityActions.LogoutSuccessAction()))
    );

  @Effect()
  refreshToken$: Observable<Action> = this.actions$
    .ofType(securityActions.REFRESH_ACCESS_TOKEN)
    .mergeMap(() => this.store.select(fromRoot.getAuthenticationState).take(1))
    .mergeMap(state =>
      this.authenticationService.refreshAccessToken(state.tenant)
        .map(authentication => new securityActions.RefreshAccessTokenSuccessAction(authentication))
        .catch((error) => of(new securityActions.RefreshAccessTokenFailAction(error)))
    );

  @Effect()
  startAccessTokenRefreshTimerAfterLogin$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGIN_SUCCESS)
    .map((action: securityActions.LoginSuccessAction) => action.payload)
    .map(payload => new Date(payload.authentication.accessTokenExpiration).getTime())
    .map(accessTokenExpirationMillies => new Date(accessTokenExpirationMillies - this.tokenExpiryBuffer))
    .map(dueTime => new securityActions.RefreshAccessTokenStartTimerAction(dueTime));

  @Effect()
  startAccessTokenRefreshTimerAfterRefresh$: Observable<Action> = this.actions$
    .ofType(securityActions.REFRESH_ACCESS_TOKEN_SUCCESS)
    .map((action: securityActions.RefreshAccessTokenSuccessAction) => action.payload)
    .map(payload => new Date(payload.accessTokenExpiration).getTime())
    .map(accessTokenExpirationMillies => new Date(accessTokenExpirationMillies - this.tokenExpiryBuffer))
    .map(dueTime => new securityActions.RefreshAccessTokenStartTimerAction(dueTime));

  @Effect()
  refreshAccessTokenStartTimer$: Observable<Action> = this.actions$
    .ofType(securityActions.REFRESH_ACCESS_TOKEN_START_TIMER)
    .map((action: securityActions.RefreshAccessTokenStartTimerAction) => action.payload)
    .mergeMap(dueTime =>
      Observable.timer(dueTime)
        .switchMap(() => of(new securityActions.RefreshAccessTokenAction()))
    );

  @Effect()
  refreshTokenStartTimer$: Observable<Action> = this.actions$
    .ofType(securityActions.REFRESH_TOKEN_START_TIMER)
    .map((action: securityActions.RefreshTokenStartTimerAction) => action.payload)
    .mergeMap(dueTime =>
      Observable.timer(dueTime)
        .switchMap(() => of(new securityActions.LogoutAction()))
    );

  @Effect()
  changePassword$: Observable<Action> = this.actions$
    .ofType(securityActions.CHANGE_PASSWORD)
    .map((action: securityActions.ChangePasswordAction) => action.payload)
    .mergeMap(payload =>
      this.identityService.changePassword(payload.username, new Password(payload.password))
        .map(() => new securityActions.ChangePasswordSuccessAction())
        .catch(error => of(new securityActions.ChangePasswordFailAction(error)))
    );

  @Effect()
  logoutOnPasswordChange$: Observable<Action> = this.actions$
    .ofType(securityActions.CHANGE_PASSWORD_SUCCESS)
    .mergeMap(() => Observable.of(new securityActions.LogoutAction()));
}
