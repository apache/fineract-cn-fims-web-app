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
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Actions, Effect,ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import * as identificationCardActions from '../identity-cards.actions';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class CustomerIdentificationCardRouteEffects {
  @Effect({ dispatch: false })
  createIdentificationCardSuccess$: Observable<Action> = this.actions$
    .pipe(ofType(identificationCardActions.CREATE_SUCCESS, identificationCardActions.UPDATE_SUCCESS),
    map(action => (action as any).payload),
    tap(payload => this.router.navigate(['../'], { relativeTo: payload.activatedRoute })));

  @Effect({ dispatch: false })
  deleteIdentificationCardSuccess$: Observable<Action> = this.actions$
    .pipe(ofType(identificationCardActions.DELETE_SUCCESS),
    map(action => (action as any).payload),
    tap(payload => this.router.navigate(['../../../../../../'], { relativeTo: payload.activatedRoute })));

  constructor(private actions$: Actions, private router: Router) { }

}
