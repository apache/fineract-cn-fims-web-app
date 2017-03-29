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
import * as ledgerActions from '../ledger.actions';
import {NotificationService, NotificationType} from '../../../../../services/notification/notification.service';

@Injectable()
export class LedgerNotificationEffects {

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect({ dispatch: false })
  createLedgerSuccess$: Observable<Action> = this.actions$
    .ofType(ledgerActions.CREATE_SUCCESS, ledgerActions.CREATE_SUB_LEDGER_SUCCESS, ledgerActions.UPDATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Ledger is going to be saved'
    }));

  @Effect({ dispatch: false })
  deleteLedgerSuccess$: Observable<Action> = this.actions$
    .ofType(ledgerActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Ledger is going to be deleted'
    }));

  @Effect({ dispatch: false })
  deleteLedgerFail$: Observable<Action> = this.actions$
    .ofType(ledgerActions.DELETE_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Ledger can\'t be deleted',
      message: 'Ledger has accounts or sub ledgers'
    }));
}

