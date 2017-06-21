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
import {Effect, Actions, toPayload} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import * as productActions from '../product.actions';
import {NotificationService, NotificationType} from '../../../../../services/notification/notification.service';

@Injectable()
export class ProductNotificationEffects {

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect({ dispatch: false })
  createProductSuccess$: Observable<Action> = this.actions$
    .ofType(productActions.CREATE_SUCCESS, productActions.UPDATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Product is going to be saved'
    }));

  @Effect({ dispatch: false })
  deleteProductSuccess$: Observable<Action> = this.actions$
    .ofType(productActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Product is going to be deleted'
    }));

  @Effect({ dispatch: false })
  deleteProductFail$: Observable<Action> = this.actions$
    .ofType(productActions.DELETE_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Product can\'t be deleted',
      message: 'Product is already assigned to a customer.'
    }));

  @Effect({ dispatch: false })
  enableProductSuccess$: Observable<Action> = this.actions$
    .ofType(productActions.ENABLE_SUCCESS)
    .map(toPayload)
    .do(payload => {
      const action: string = payload.enable ? 'enabled' : 'disabled';
      this.notificationService.send({
        type: NotificationType.MESSAGE,
        message: `Product is going to be ${action}`
      })
    });

  @Effect({ dispatch: false })
  enableProductFail$: Observable<Action> = this.actions$
    .ofType(productActions.ENABLE_FAIL)
    .map(toPayload)
    .do(payload => this.notificationService.send({
      type: NotificationType.ALERT,
      message: 'Product could not be enabled'
    }));
}
