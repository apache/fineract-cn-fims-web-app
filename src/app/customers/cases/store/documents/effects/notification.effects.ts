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
import {Observable} from 'rxjs/Observable';
import * as documents from '../document.actions';
import {Action} from '@ngrx/store';
import {NotificationService, NotificationType} from '../../../../../services/notification/notification.service';

@Injectable()
export class CaseDocumentNotificationEffects {

  @Effect({ dispatch: false })
  createDocumentSuccess$: Observable<Action> = this.actions$
    .ofType(documents.CREATE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Document is going to be saved'
    }));

  @Effect({ dispatch: false })
  deleteDocumentSuccess$: Observable<Action> = this.actions$
    .ofType(documents.DELETE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Document is going to be deleted'
    }));

  @Effect({ dispatch: false })
  uploadPageSuccess$: Observable<Action> = this.actions$
    .ofType(documents.UPLOAD_PAGE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Page is going to be uploaded'
    }));

  @Effect({ dispatch: false })
  uploadPageFail$: Observable<Action> = this.actions$
    .ofType(documents.UPLOAD_PAGE_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      message: 'Please choose a different page number'
    }));

  @Effect({ dispatch: false })
  deletePageSuccess$: Observable<Action> = this.actions$
    .ofType(documents.DELETE_PAGE_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Page is going to be deleted'
    }));

  @Effect({ dispatch: false })
  lockDocumentSuccess$: Observable<Action> = this.actions$
    .ofType(documents.LOCK_SUCCESS)
    .do(() => this.notificationService.send({
      type: NotificationType.MESSAGE,
      message: 'Document locked'
    }));

  @Effect({ dispatch: false })
  lockDocumentFail$: Observable<Action> = this.actions$
    .ofType(documents.LOCK_FAIL)
    .do(() => this.notificationService.send({
      type: NotificationType.ALERT,
      title: 'Document could not be locked',
      message: 'Please make sure all pages are uploaded and are in sequence'
    }));

  constructor(private actions$: Actions, private notificationService: NotificationService) {}
}
