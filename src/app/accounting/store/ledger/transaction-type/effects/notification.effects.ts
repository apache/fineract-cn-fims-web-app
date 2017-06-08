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
import * as transactionTypeActions from '../transaction-type.actions';
import {NotificationService, NotificationType} from '../../../../../../services/notification/notification.service';

@Injectable()
export class TransactionTypeNotificationEffects {
  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect({ dispatch: false })
  createTransactionTypeSuccess$: Observable<Action> = this.actions$
    .ofType(transactionTypeActions.CREATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Transaction type is going to be created'
    }));

  @Effect({ dispatch: false })
  updateTransactionTypeSuccess$: Observable<Action> = this.actions$
    .ofType(transactionTypeActions.UPDATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Transaction type is going to be updated'
    }));
}
