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
import {Observable} from 'rxjs/Observable';
import {NotificationService, NotificationType} from '../../../../services/notification/notification.service';
import {Action} from '@ngrx/store';
import * as catalogActions from '../catalog.actions';

@Injectable()
export class CatalogNotificationEffects {

  @Effect({ dispatch: false })
  createCatalogSuccess$: Observable<Action> = this.actions$
    .ofType(catalogActions.CREATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Catalog is going to be saved'
    }));

  @Effect({ dispatch: false })
  deleteCatalogSuccess$: Observable<Action> = this.actions$
    .ofType(catalogActions.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Catalog is going to be deleted'
    }));

  @Effect({ dispatch: false })
  deleteCatalogFail$: Observable<Action> = this.actions$
    .ofType(catalogActions.DELETE_FAIL)
    .do((error: Error) => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Catalog can\'t be deleted',
      message: error.message
    }));

  @Effect({ dispatch: false })
  updateFieldSuccess$: Observable<Action> = this.actions$
    .ofType(catalogActions.UPDATE_FIELD_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Field is going to be updated'
    }));

  @Effect({ dispatch: false })
  updateFieldFail$: Observable<Action> = this.actions$
    .ofType(catalogActions.UPDATE_FIELD_FAIL)
    .do((error: Error) => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Field can\'t be updated',
      message: error.message
    }));

  @Effect({ dispatch: false })
  deleteFieldSuccess$: Observable<Action> = this.actions$
    .ofType(catalogActions.DELETE_FIELD_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Field is going to be deleted'
    }));

  @Effect({ dispatch: false })
  deleteFieldFail$: Observable<Action> = this.actions$
    .ofType(catalogActions.DELETE_FIELD_FAIL)
    .do((error: Error) => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Field can\'t be deleted',
      message: error.message
    }));

  constructor(private actions$: Actions, private notificationService: NotificationService) {}

}
