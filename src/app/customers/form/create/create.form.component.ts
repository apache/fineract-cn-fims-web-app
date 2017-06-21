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
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {CustomerFormComponent} from '../form.component';
import * as fromCustomers from '../../store';
import {Error} from '../../../../services/domain/error.model';
import {Subscription} from 'rxjs';
import {CustomersStore} from '../../store/index';
import {CREATE, RESET_FORM} from '../../store/customer.actions';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateCustomerFormComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  @ViewChild('form') formComponent: CustomerFormComponent;

  customer: Customer = {
    identifier: '',
    type: 'PERSON',
    givenName: '',
    surname: '',
    address: {
      street: '',
      city: '',
      countryCode: '',
      country: ''
    },
    member: true,
    dateOfBirth: {},
    contactDetails: [],
    customValues: []
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: CustomersStore) {}

  ngOnInit() {
    this.formStateSubscription = this.store.select(fromCustomers.getCustomerFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.formComponent.showIdentifierValidationError());
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(customer: Customer) {
    this.store.dispatch({ type: CREATE, payload: {
      customer,
      activatedRoute: this.route
    } });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
