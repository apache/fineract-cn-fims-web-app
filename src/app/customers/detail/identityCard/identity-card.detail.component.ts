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
import {Subscription} from 'rxjs/Subscription';
import * as fromCustomers from '../../store/index';
import {CustomersStore} from '../../store/index';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {DELETE, SelectAction} from '../../store/identityCards/identity-cards.actions';
import {ActivatedRoute} from '@angular/router';
import {IdentificationCard} from '../../../../services/customer/domain/identification-card.model';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {TdDialogService} from '@covalent/core';

@Component({
  templateUrl: './identity-card.detail.component.html'
})
export class CustomerIdentityCardDetailComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  private identificationCardSubscription: Subscription;

  private customer: Customer;

  identificationCard: IdentificationCard;

  constructor(private route: ActivatedRoute, private customersStore: CustomersStore, private translate: TranslateService, private dialogService: TdDialogService) {}

  ngOnInit(): void {
    this.identificationCardSubscription = this.customersStore.select(fromCustomers.getSelectedIdentificationCard)
      .filter(identificationCard => !!identificationCard)
      .subscribe(identificationCard => this.identificationCard = identificationCard);

    this.customerSubscription = this.customersStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
    this.identificationCardSubscription.unsubscribe();
  }

  confirmDeletion(): Observable<boolean> {
    let message = 'Do you want to delete this identification card?';
    let title = 'Confirm deletion';
    let button = 'DELETE IDENTIFICATION CARD';

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  deleteIdentificationCard(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.customersStore.dispatch({ type: DELETE, payload: {
          customerId: this.customer.identifier,
          identificationCard: this.identificationCard,
          activatedRoute: this.route
        }})
      });
  }
}
