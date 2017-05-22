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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {IdentificationCard} from '../../../../../services/customer/domain/identification-card.model';
import {IdentityCardFormComponent} from './identity-card-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomersStore} from '../../../store/index';
import {CREATE, RESET_FORM} from '../../../store/identityCards/identity-cards.actions';
import * as fromCustomers from '../../../store/index'
import {Error} from '../../../../../services/domain/error.model';
import {Customer} from '../../../../../services/customer/domain/customer.model';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateCustomerIdentificationCardFormComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  private customerSubscription: Subscription;

  private customer: Customer;

  @ViewChild('form') formComponent: IdentityCardFormComponent;

  identificationCard: IdentificationCard = {
    type: '',
    number: '',
    expirationDate: null
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: CustomersStore) {}

  ngOnInit() {
    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);

    this.formStateSubscription = this.store.select(fromCustomers.getCustomerIdentificationCardFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => {
        this.formComponent.showNumberValidationError();
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(identificationCard: IdentificationCard) {
    const customerId = this.customer.identifier;
    this.store.dispatch({ type: CREATE, payload: {
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
