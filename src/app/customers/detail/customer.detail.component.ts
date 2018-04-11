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
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../services/customer/domain/customer.model';
import {Catalog} from '../../services/catalog/domain/catalog.model';
import * as fromCustomers from '../store';
import {Subscription} from 'rxjs/Subscription';
import {CustomersStore} from '../store/index';
import {CustomerService} from '../../services/customer/customer.service';
import {Observable} from 'rxjs/Observable';


interface CustomDetailField {
  label: string;
  value: string;
}

@Component({
  templateUrl: './customer.detail.component.html',
  styleUrls: ['./customer.detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  portrait: Blob;

  private customerSubscription: Subscription;

  customer: Customer;

  catalog$: Observable<Catalog>;

  isCustomerActive: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private store: CustomersStore,
              private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .filter(customer => !!customer)
      .do(customer => this.customer = customer)
      .do(customer => this.isCustomerActive = customer.currentState === 'ACTIVE')
      .flatMap(customer => this.customerService.getPortrait(customer.identifier))
      .subscribe(portrait => this.portrait = portrait);

    this.catalog$ = this.store.select(fromCustomers.getCustomerCatalog);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  searchCustomer(term): void {
    if (term) {
      this.router.navigate(['../../../'], { queryParams: { term: term }, relativeTo: this.route });
    }
  }

  changePortrait(): void {
    this.router.navigate(['portrait'], { relativeTo: this.route });
  }

  goToTasks(): void {
    this.router.navigate(['tasks'], { relativeTo: this.route });
  }

}
