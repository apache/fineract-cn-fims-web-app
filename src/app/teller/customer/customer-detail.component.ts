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
import {Component, OnDestroy} from '@angular/core';
import * as fromTeller from '../store/index';
import {TellerStore} from '../store/index';
import {Customer} from '../../services/customer/domain/customer.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {LoadAllDepositProductsAction, LoadAllLoanProductsAction} from '../store/teller.actions';
import {CustomerService} from '../../services/customer/customer.service';
import {Action, AvailableActionService} from '../services/available-actions.service';

@Component({
  templateUrl: './customer-detail.component.html'
})
export class TellerCustomerDetailComponent implements OnDestroy {

  private loadDepositProductsSubscription: Subscription;

  private loadLoanProductsSubscription: Subscription;

  portrait$: Observable<Blob>;

  customer$: Observable<Customer>;

  hasDepositProducts$: Observable<boolean>;

  hasLoanProducts$: Observable<boolean>;

  availableActions$: Observable<Action[]>;

  constructor(private store: TellerStore, private customerService: CustomerService, private actionService: AvailableActionService) {
    this.customer$ = store.select(fromTeller.getTellerSelectedCustomer)
      .filter(customer => !!customer);

    this.portrait$ = this.customer$
      .flatMap(customer => this.customerService.getPortrait(customer.identifier));

    this.hasDepositProducts$ = store.select(fromTeller.hasTellerCustomerDepositProducts);

    this.hasLoanProducts$ = store.select(fromTeller.hasTellerCustomerLoanProducts);

    this.loadDepositProductsSubscription = this.customer$
      .map(customer => new LoadAllDepositProductsAction(customer.identifier))
      .subscribe(this.store);

    this.loadLoanProductsSubscription = this.customer$
      .map(customer => new LoadAllLoanProductsAction(customer.identifier))
      .subscribe(this.store);

    this.availableActions$ = this.customer$
      .mergeMap(customer => this.actionService.getAvailableActions(customer.identifier));
  }

  ngOnDestroy(): void {
    this.loadDepositProductsSubscription.unsubscribe();
    this.loadLoanProductsSubscription.unsubscribe();
  }
}
