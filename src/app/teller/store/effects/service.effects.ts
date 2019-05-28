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
import { TellerService } from '../../../services/teller/teller-service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as tellerActions from '../teller.actions';
import { map, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class TellerApiEffects {

  @Effect()
  unlockDrawer$: Observable<Action> = this.actions$
    .pipe(ofType(tellerActions.UNLOCK_DRAWER),
      map((action: tellerActions.UnlockDrawerAction) => action.payload),
      mergeMap(payload =>
        this.tellerService.unlockDrawer(payload.tellerCode, { employeeIdentifier: payload.employeeId, password: payload.password }).pipe(
          map(teller => new tellerActions.UnlockDrawerSuccessAction(teller)),
          catchError((error) => of(new tellerActions.UnlockDrawerFailAction(error))))
      ));

  @Effect()
  lockDrawer$: Observable<Action> = this.actions$
    .pipe(ofType(tellerActions.LOCK_DRAWER),
      map((action: tellerActions.LockDrawerAction) => action.payload),
      mergeMap(payload =>
        this.tellerService.executeCommand(payload.tellerCode, 'PAUSE').pipe(
          map(() => new tellerActions.LockDrawerSuccessAction()),
          catchError((error) => of(new tellerActions.LockDrawerSuccessAction())))
      ));

  @Effect()
  confirmTransaction$: Observable<Action> = this.actions$
    .pipe(ofType(tellerActions.CONFIRM_TRANSACTION),
      map((action: tellerActions.ConfirmTransactionAction) => action.payload),
      mergeMap(payload =>
        this.tellerService.confirmTransaction(payload.tellerCode, payload.tellerTransactionIdentifier, payload.command,
          payload.chargesIncluded).pipe(
            map(() => new tellerActions.ConfirmTransactionSuccessAction(payload)),
            catchError((error) => of(new tellerActions.ConfirmTransactionFailAction(error))))
      ));

  constructor(private actions$: Actions, private tellerService: TellerService) { }
}
