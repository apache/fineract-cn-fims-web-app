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
import {NotificationService, NotificationType} from '../../../../services/notification/notification.service';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import * as instanceActions from '../deposit.actions';
import { tap} from 'rxjs/operators'

@Injectable()
export class DepositProductInstanceNotificationEffects {

  @Effect({dispatch: false})
  createProductInstanceSuccess$: Observable<Action> = this.actions$
    .pipe(ofType(instanceActions.CREATE_SUCCESS, instanceActions.UPDATE_SUCCESS),
      tap(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Deposit account is going to be saved'
    })));

  @Effect({dispatch: false})
  issueChequesSuccess$: Observable<Action> = this.actions$
    .pipe(ofType(instanceActions.ISSUE_CHEQUES_SUCCESS),
      tap(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Cheques are going to be issued'
    })));

  @Effect({dispatch: false})
  issueChequesFail$: Observable<Action> = this.actions$
    .pipe(ofType(instanceActions.ISSUE_CHEQUES_FAIL),
      tap(() => this.notificationService.send({
      type: NotificationType.ALERT,
      message: 'There was an issue issuing cheques'
    })));

  constructor(private actions$: Actions, private notificationService: NotificationService) {}
}
