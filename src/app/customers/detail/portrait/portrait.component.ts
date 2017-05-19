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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomerService} from '../../../../services/customer/customer.service';
import {Subscription} from 'rxjs/Subscription';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {CustomersStore} from '../../store/index';
import * as fromCustomers from '../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService, NotificationType} from '../../../../services/notification/notification.service';
import {TdDialogService} from '@covalent/core';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';

@Component({
  templateUrl: './portrait.component.html'
})
export class CustomerPortraitComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  private customer: Customer;

  fileSelectMsg: string = 'No file selected yet.';

  invalidSize: boolean = false;

  portrait: Blob;

  constructor(private router: Router, private route: ActivatedRoute, private customerService: CustomerService,
              private store: CustomersStore, private notificationService: NotificationService,
              private dialogService: TdDialogService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .do(customer => this.customer = customer)
      .flatMap(customer => this.customerService.getPortrait(customer.identifier))
      .subscribe(portrait => this.portrait = portrait);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  selectEvent(file: File): void {
    this.invalidSize = file.size > 524288;
    this.fileSelectMsg = file.name;
  };

  uploadEvent(file: File): void {
    if(this.invalidSize) return;

    this.customerService.uploadPortrait(this.customer.identifier, file).subscribe(() => {
      this.notificationService.send({
        type: NotificationType.MESSAGE,
        message: 'Portrait is going to be uploaded'
      });
      this.navigateAway();
    });
  };

  confirmDeletion(): Observable<boolean>{
    let message = 'Do you want to delete the portrait?';
    let title = 'Confirm deletion';
    let button = 'DELETE PORTRAIT';

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  deletePortrait(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .flatMap(() => this.customerService.deletePortrait(this.customer.identifier))
      .subscribe(() => {
        this.notificationService.send({
          type: NotificationType.MESSAGE,
          message: 'Portrait is going to be deleted'
        });
        this.navigateAway();
      });
  }

  navigateAway(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
