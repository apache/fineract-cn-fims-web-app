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
import {IdentificationCard} from '../../../../../services/customer/domain/identification-card.model';
import {Observable} from 'rxjs/Observable';
import {CustomersStore} from '../../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {UPDATE} from '../../../store/identityCards/identity-cards.actions';
import {Customer} from '../../../../../services/customer/domain/customer.model';
import * as fromCustomers from '../../../store/index';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditCustomerIdentificationCardFormComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  private customer: Customer;

  identificationCard$: Observable<IdentificationCard>;

  constructor(private router: Router, private route: ActivatedRoute, private customersStore: CustomersStore) {}

  ngOnInit() {
    this.customerSubscription = this.customersStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);

    this.identificationCard$ = this.customersStore.select(fromCustomers.getSelectedIdentificationCard);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  onSave(identificationCard: IdentificationCard) {
    const customerId = this.customer.identifier;

    this.customersStore.dispatch({ type: UPDATE, payload: {
      customerId,
      identificationCard,
      activatedRoute: this.route
    } });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
