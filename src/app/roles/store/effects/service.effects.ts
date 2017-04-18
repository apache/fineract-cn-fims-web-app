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

import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as roleActions from '../role.actions';
import {IdentityService} from '../../../../services/identity/identity.service';

@Injectable()
export class RoleApiEffects {

  constructor(private actions$: Actions, private identityService: IdentityService) { }

  @Effect()
  createRole$: Observable<Action> = this.actions$
    .ofType(roleActions.CREATE)
    .map((action: roleActions.CreateRoleAction) => action.payload)
    .mergeMap(role =>
      this.identityService.createRole(role)
        .map(() => new roleActions.CreateRoleSuccessAction({
          resource: role,
          activatedRoute: null
        }))
        .catch((error) => of(new roleActions.CreateRoleFailAction(error)))
    );

  @Effect()
  updateRole$: Observable<Action> = this.actions$
    .ofType(roleActions.UPDATE)
    .map((action: roleActions.UpdateRoleAction) => action.payload)
    .mergeMap(role =>
      this.identityService.changeRole(role)
        .map(() => new roleActions.UpdateRoleSuccessAction({
          resource: role,
          activatedRoute: null
        }))
        .catch((error) => of(new roleActions.UpdateRoleFailAction(error)))
    );

  @Effect()
  deleteRole$: Observable<Action> = this.actions$
    .ofType(roleActions.DELETE)
    .map((action: roleActions.DeleteRoleAction) => action.payload)
    .mergeMap(role =>
      this.identityService.deleteRole(role.identifier)
        .map(() => new roleActions.DeleteRoleSuccessAction({
          resource: role,
          activatedRoute: null
        }))
        .catch((error) => of(new roleActions.DeleteRoleFailAction(error)))
    );

}
