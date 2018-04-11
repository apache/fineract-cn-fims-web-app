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
import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {NotificationService, NotificationType} from '../../../../../services/notification/notification.service';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as identificationCardScanActions from '../scans.actions';

@Injectable()
export class CustomerIdentificationCardScanNotificationEffects {

  @Effect({ dispatch: false })
  createIdentificationCardScanSuccess$: Observable<Action> = this.actions$
    .ofType(identificationCardScanActions.CREATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Scan is going to be uploaded'
    }));

  @Effect({ dispatch: false })
  deleteIdentificationCardScanSuccess$: Observable<Action> = this.actions$
    .ofType(identificationCardScanActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Scan is going to be deleted'
    }));

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

}
