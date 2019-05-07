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
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TellerService } from '../../../../services/teller/teller-service';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as tellerActions from '../../teller/teller.actions';

@Injectable()
export class TellerApiEffects {

  @Effect()
  loadTeller$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOAD_TELLER).pipe(
      map((action: tellerActions.LoadTellerAction) => action.payload),
      mergeMap(officeId =>
        this.tellerService.fetch(officeId).pipe(
          map((teller) => new tellerActions.LoadTellerSuccessAction(teller)),
          catchError((error) => of(new tellerActions.LoadTellerSuccessAction([]))))
      ));

  @Effect()
  createTeller$: Observable<Action> = this.actions$
    .ofType(tellerActions.CREATE_TELLER).pipe(
      map((action: tellerActions.CreateTellerAction) => action.payload),
      mergeMap(payload =>
        this.tellerService.create(payload.officeId, payload.teller).pipe(
          map(() => new tellerActions.CreateTellerSuccessAction({
            activatedRoute: payload.activatedRoute,
            resource: payload.teller
          })),
          catchError((error) => of(new tellerActions.CreateTellerFailAction(error))))
      ));

  @Effect()
  updateTeller$: Observable<Action> = this.actions$
    .ofType(tellerActions.UPDATE_TELLER).pipe(
      map((action: tellerActions.UpdateTellerAction) => action.payload),
      mergeMap(payload =>
        this.tellerService.change(payload.officeId, payload.teller).pipe(
          map(() => new tellerActions.UpdateTellerSuccessAction({
            activatedRoute: payload.activatedRoute,
            resource: payload.teller
          })),
          catchError((error) => of(new tellerActions.UpdateTellerFailAction(error))))
      ));

  @Effect()
  executeCommand$: Observable<Action> = this.actions$
    .ofType(tellerActions.EXECUTE_COMMAND).pipe(
      map((action: tellerActions.ExecuteCommandAction) => action.payload),
      mergeMap(payload =>
        this.tellerService.createCommand(payload.officeId, payload.tellerCode, payload.command).pipe(
          map(() => new tellerActions.ExecuteCommandSuccessAction(payload)),
          catchError((error) => of(new tellerActions.ExecuteCommandFailAction({
            command: payload.command,
            error
          }))))
      ));

  constructor(private actions$: Actions, private tellerService: TellerService) { }

}
