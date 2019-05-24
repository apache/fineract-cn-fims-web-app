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
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as roleActions from '../role.actions';
import { IdentityService } from '../../../services/identity/identity.service';
import { map, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class RoleApiEffects {

  @Effect()
  createRole$: Observable<Action> = this.actions$
    .pipe(ofType(roleActions.CREATE),
      map((action: roleActions.CreateRoleAction) => action.payload),
      mergeMap(payload =>
        this.identityService.createRole(payload.role).pipe(
          map(() => new roleActions.CreateRoleSuccessAction({
            resource: payload.role,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new roleActions.CreateRoleFailAction(error))))
      ));

  @Effect()
  updateRole$: Observable<Action> = this.actions$
    .pipe(ofType(roleActions.UPDATE),
      map((action: roleActions.UpdateRoleAction) => action.payload),
      mergeMap(payload =>
        this.identityService.changeRole(payload.role).pipe(
          map(() => new roleActions.UpdateRoleSuccessAction({
            resource: payload.role,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new roleActions.UpdateRoleFailAction(error))))
      ));

  @Effect()
  deleteRole$: Observable<Action> = this.actions$
    .pipe(ofType(roleActions.DELETE),
      map((action: roleActions.DeleteRoleAction) => action.payload),
      mergeMap(payload =>
        this.identityService.deleteRole(payload.role.identifier).pipe(
          map(() => new roleActions.DeleteRoleSuccessAction({
            resource: payload.role,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new roleActions.DeleteRoleFailAction(error))))
      ));

  constructor(private actions$: Actions, private identityService: IdentityService) { }

}
