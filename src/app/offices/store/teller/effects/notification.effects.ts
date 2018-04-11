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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {NotificationService, NotificationType} from '../../../../services/notification/notification.service';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as tellerActions from '../teller.actions';

@Injectable()
export class TellerNotificationEffects {

  @Effect({ dispatch: false })
  createTellerSuccess$: Observable<Action> = this.actions$
    .ofType(tellerActions.CREATE_TELLER_SUCCESS, tellerActions.UPDATE_TELLER_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Teller is going to be saved'
    }));

  @Effect({ dispatch: false })
  executeCommandSuccess$: Observable<Action> = this.actions$
    .ofType(tellerActions.EXECUTE_COMMAND_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Teller is going to be updated'
    }));

  @Effect({ dispatch: false })
  openCommandFail$: Observable<Action> = this.actions$
    .ofType(tellerActions.EXECUTE_COMMAND_FAIL)
    .map(action => action.payload.command)
    .filter(command => command.action === 'OPEN')
    .do(action => this.notificationService.send({
        type: NotificationType.ALERT,
        title: 'Employee already assigned',
        message: 'Employees can only be assigned to one teller. Please choose a different employee or unassign the employee first.'
      })
    );

  @Effect({ dispatch: false })
  closeCommandFail$: Observable<Action> = this.actions$
    .ofType(tellerActions.EXECUTE_COMMAND_FAIL)
    .map(action => action.payload.command)
    .filter(command => command.action === 'CLOSE')
    .do(action => this.notificationService.send({
        type: NotificationType.ALERT,
        title: 'Denomination required',
        message: 'This teller requires a denomination before it can be closed.'
      })
    );

  constructor(private actions$: Actions, private notificationService: NotificationService) {
  }
}
