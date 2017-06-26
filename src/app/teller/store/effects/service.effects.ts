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
import {Actions, Effect} from '@ngrx/effects';
import {TellerService} from '../../../../services/teller/teller-service';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as tellerActions from '../teller.actions';
import {of} from 'rxjs/observable/of';

@Injectable()
export class TellerApiEffects {

  constructor(private actions$: Actions, private tellerService: TellerService) {}

  @Effect()
  unlockDrawer$: Observable<Action> = this.actions$
    .ofType(tellerActions.UNLOCK_DRAWER)
    .map((action: tellerActions.UnlockDrawerAction) => action.payload)
    .mergeMap(payload =>
      this.tellerService.unlockDrawer(payload.tellerCode, {employeeIdentifier: payload.employeeId, password: payload.password})
        .map(teller => new tellerActions.UnlockDrawerSuccessAction(teller))
        .catch((error) => of(new tellerActions.UnlockDrawerFailAction(error)))
    );

  @Effect()
  lockDrawer$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOCK_DRAWER)
    .map((action: tellerActions.LockDrawerAction) => action.payload)
    .mergeMap(payload =>
      this.tellerService.executeCommand(payload.tellerCode, 'PAUSE')
        .map(() => new tellerActions.LockDrawerSuccessAction())
        .catch((error) => of(new tellerActions.LockDrawerSuccessAction()))
    );

  @Effect()
  confirmTransaction$: Observable<Action> = this.actions$
    .ofType(tellerActions.CONFIRM_TRANSACTION)
    .map((action: tellerActions.ConfirmTransactionAction) => action.payload)
    .mergeMap(payload =>
      this.tellerService.confirmTransaction(payload.tellerCode, payload.tellerTransactionIdentifier, payload.command)
        .map(() => new tellerActions.ConfirmTransactionSuccessAction(payload))
        .catch((error) => of(new tellerActions.ConfirmTransactionFailAction(error)))
    );
}
