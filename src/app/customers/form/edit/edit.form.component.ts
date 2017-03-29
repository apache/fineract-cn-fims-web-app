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
import {Router, ActivatedRoute} from '@angular/router';
import {Customer} from '../../../../services/customer/domain/customer.model';
import * as fromCustomers from '../../store';
import {Subscription} from 'rxjs';
import {CustomersStore} from '../../store/index';
import {UPDATE} from '../../store/customer.actions';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditCustomerFormComponent implements OnInit, OnDestroy{

  private customerSubscription: Subscription;

  customer: Customer;

  constructor(private router: Router, private route: ActivatedRoute, private store: CustomersStore) {}

  ngOnInit() {
    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  onSave(customer: Customer) {
    this.store.dispatch({ type: UPDATE, payload: {
      customer,
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
