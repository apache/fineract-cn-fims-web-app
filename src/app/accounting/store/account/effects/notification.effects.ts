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
import * as accountActions from '../account.actions';
import {NotificationService, NotificationType} from '../../../../../services/notification/notification.service';

@Injectable()
export class AccountNotificationEffects {

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect({ dispatch: false })
  createAccountSuccess$: Observable<Action> = this.actions$
    .ofType(accountActions.CREATE_SUCCESS, accountActions.UPDATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Account is going to be saved'
    }));

  @Effect({ dispatch: false })
  deleteAccountSuccess$: Observable<Action> = this.actions$
    .ofType(accountActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Account is going to be deleted'
    }));

  @Effect({ dispatch: false })
  deleteAccountFail$: Observable<Action> = this.actions$
    .ofType(accountActions.DELETE_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Account can\'t be deleted',
      message: 'Account has account entries'
    }));
}

