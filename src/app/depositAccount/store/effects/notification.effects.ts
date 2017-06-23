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
import * as definitionActions from '../product.actions';

@Injectable()
export class DepositProductDefinitionNotificationEffects {

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect({dispatch: false})
  createProductDefinitionSuccess$: Observable<Action> = this.actions$
    .ofType(definitionActions.CREATE_SUCCESS, definitionActions.UPDATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Product is going to be saved'
    }));

  @Effect({dispatch: false})
  deleteProductDefinitionSuccess$: Observable<Action> = this.actions$
    .ofType(definitionActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Product is going to be deleted'
    }));

  @Effect({dispatch: false})
  deleteProductDefinitionFail$: Observable<Action> = this.actions$
    .ofType(definitionActions.DELETE_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      message: 'Product is already assigned to a customer.'
    }));

  @Effect({dispatch: false})
  executeCommandSuccess$: Observable<Action> = this.actions$
    .ofType(definitionActions.EXECUTE_COMMAND_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Product is going to be updated'
    }));
}
