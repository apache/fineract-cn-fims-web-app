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
import * as officeActions from '../office.actions';
import {Router} from '@angular/router';
import {CreateOfficeSuccessAction} from '../office.actions';

@Injectable()
export class OfficeRouteEffects {
  constructor(private actions$: Actions, private router: Router) { }

  @Effect({ dispatch: false })
  createOfficeSuccess$: Observable<Action> = this.actions$
    .ofType(officeActions.CREATE_SUCCESS)
    .map(action => action.payload)
    .do(payload => {
      if(payload.resource.parentIdentifier){
        this.router.navigate(['../detail', payload.resource.parentIdentifier], { relativeTo: payload.activatedRoute });
      }else{
        this.router.navigate(['../detail', payload.resource.identifier], { relativeTo: payload.activatedRoute });
      }
    });

  @Effect({ dispatch: false })
  updateOfficeSuccess$: Observable<Action> = this.actions$
    .ofType(officeActions.UPDATE_SUCCESS)
    .map(action => action.payload)
    .do(payload => this.router.navigate(['../../', payload.resource.identifier], { relativeTo: payload.activatedRoute }));

  @Effect({ dispatch: false })
  deleteOfficeSuccess$: Observable<Action> = this.actions$
    .ofType(officeActions.DELETE_SUCCESS)
    .map((action) => action.payload)
    .do(payload => {
      if(payload.resource.parentIdentifier){
        this.router.navigate(['../../', payload.resource.parentIdentifier], { relativeTo: payload.activatedRoute})
      }else{
        this.router.navigate(['../../'], { relativeTo: payload.activatedRoute})
      }
    });
}
