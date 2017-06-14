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
import {NotificationService, NotificationType} from '../../../../services/notification/notification.service';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as tellerActions from '../teller.actions';

@Injectable()
export class TellerNotificationEffects {

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect({ dispatch: false })
  unlockDrawerSuccess$: Observable<Action> = this.actions$
    .ofType(tellerActions.UNLOCK_DRAWER_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Teller drawer unlocked'
    }));

  @Effect({ dispatch: false })
  lockDrawerSuccess$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOCK_DRAWER_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Teller drawer is now locked'
    }));

  @Effect({ dispatch: false })
  confirmTransaction: Observable<Action> = this.actions$
    .ofType(tellerActions.CONFIRM_TRANSACTION_SUCCESS)
    .map(action => action.payload)
    .do((payload) => {
      const action: string = payload.command === 'CONFIRM' ? 'confirmed' : 'canceled';
      this.notificationService.send({
        type: NotificationType.MESSAGE,
        message: `Transaction successfully ${action}`
      })
    });

}
