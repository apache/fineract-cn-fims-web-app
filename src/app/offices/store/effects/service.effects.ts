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
import {OfficeService} from '../../../../services/office/office.service';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as officeActions from '../office.actions';

@Injectable()
export class OfficeApiEffects {

  constructor(private actions$: Actions, private officeService: OfficeService) {}

  @Effect()
  createOffice$: Observable<Action> = this.actions$
    .ofType(officeActions.CREATE)
    .map((action: officeActions.CreateOfficeAction) => action.payload)
    .mergeMap(payload =>
      this.officeService.createOffice(payload.office)
        .map(() => new officeActions.CreateOfficeSuccessAction({
          resource: payload.office,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new officeActions.CreateOfficeFailAction(error)))
    );

  @Effect()
  createBranchOffice$: Observable<Action> = this.actions$
    .ofType(officeActions.CREATE_BRANCH)
    .map((action: officeActions.CreateBranchOfficeAction) => action.payload)
    .mergeMap(payload =>
      this.officeService.addBranch(payload.office.parentIdentifier, payload.office)
        .map(() => new officeActions.CreateOfficeSuccessAction({
          resource: payload.office,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new officeActions.CreateOfficeFailAction(error)))
    );

  @Effect()
  updateOffice$: Observable<Action> = this.actions$
    .ofType(officeActions.UPDATE)
    .map((action: officeActions.UpdateOfficeAction) => action.payload)
    .mergeMap(payload =>
      this.officeService.updateOffice(payload.office)
        .map(() => new officeActions.UpdateOfficeSuccessAction({
          resource: payload.office,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new officeActions.UpdateOfficeFailAction(error)))
    );

  @Effect()
  deleteOffice$: Observable<Action> = this.actions$
    .ofType(officeActions.DELETE)
    .map((action: officeActions.DeleteOfficeAction) => action.payload)
    .mergeMap(payload =>
      this.officeService.deleteOffice(payload.office.identifier)
        .map(() => new officeActions.DeleteOfficeSuccessAction({
          resource: payload.office,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new officeActions.DeleteOfficeFailAction(error)))
    );

}
