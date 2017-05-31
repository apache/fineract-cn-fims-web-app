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
import {NotificationType, NotificationService} from '../../../../services/notification/notification.service';

@Injectable()
export class OfficeNotificationEffects {
  constructor(private actions$: Actions, private notificationService: NotificationService) {
  }

  @Effect({ dispatch: false })
  createOfficeSuccess$: Observable<Action> = this.actions$
    .ofType(officeActions.CREATE_SUCCESS, officeActions.UPDATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Office is going to be saved'
    }));

  @Effect({ dispatch: false })
  deleteOfficeSuccess$: Observable<Action> = this.actions$
    .ofType(officeActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Office is going to be deleted'
    }));

  @Effect({ dispatch: false })
  deleteOfficeFail$: Observable<Action> = this.actions$
    .ofType(officeActions.DELETE_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Office can\'t be deleted',
      message: 'Office has either branch offices or employees assigned to it.'
    }));
}

