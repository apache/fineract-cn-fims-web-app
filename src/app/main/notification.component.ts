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

import {AfterViewInit, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {NotificationEvent, NotificationService, NotificationType} from '../services/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '../services/http/http.service';
import {TdDialogService} from '@covalent/core';
import {Subscription} from 'rxjs/Subscription';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'fims-notification',
  template: ''
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {

  private notificationSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(private notificationService: NotificationService, private translate: TranslateService, private httpClient: HttpClient,
              private snackBar: MatSnackBar, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService) {}

  ngOnInit(): void {
    const config: MatSnackBarConfig = new MatSnackBarConfig();
    config.viewContainerRef = this.viewContainerRef;
    this.notificationSubscription = this.notificationService.notifications$
      .subscribe((notification: NotificationEvent) => this.showNotification(notification, config));
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.errorSubscription = this.httpClient.error.subscribe((error: any) => this.showError(error));
  }

  private showNotification(notification: NotificationEvent, config: MatSnackBarConfig): void {
    switch (notification.type) {
      case NotificationType.MESSAGE:
        this.showMessage(notification.message, config);
        break;
      case NotificationType.ALERT:
        this.showAlert(notification.title, notification.message);
        break;
      default:
        break;
    }
  }

  private showError(error: any): void {
    switch (error.status) {
      case 400:
        this.showAlert('Unexpected error',
          'We are very sorry, it seems the request you sent could not be accepted by our servers.'
        );
        break;
      case 404:
        this.showAlert('Resource not available',
          'It seems the resource you requested is either not available or you don\'t have the permission to access it.'
        );
        break;
      case 504:
      case 500:
        this.showAlert('Service not available',
          'We are very sorry, it seems there is a problem with our servers. Please contact your administrator if the problem occurs.'
        );
        break;
      default:
        break;
    }
  }

  private showMessage(message: string, config: MatSnackBarConfig): void {
    this.translate.get(message)
      .take(1)
      .subscribe((result) => {
        const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(result, '', config);
        setTimeout(() => snackBarRef.dismiss(), 3000);
      });
  }

  private showAlert(title: string = '', message: string): void {
    this.translate.get([title, message, 'OK'])
      .take(1)
      .subscribe((result) => {
        this.dialogService.openAlert({
          message: result[message],
          viewContainerRef: this.viewContainerRef,
          title: result[title],
          closeButton: result['OK']
        });
    });

  }
}
