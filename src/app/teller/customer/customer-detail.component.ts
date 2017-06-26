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

import {Component, OnDestroy} from '@angular/core';
import {TellerStore} from '../store/index';
import * as fromTeller from '../store/index';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {LoadAllDepositProductsAction, LoadAllLoanProductsAction} from '../store/teller.actions';
import {CustomerService} from '../../../services/customer/customer.service';
import {TransactionType} from '../../../services/teller/domain/teller-transaction.model';

interface Action {
  transactionType: TransactionType;
  color: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  templateUrl: './customer-detail.component.html'
})
export class TellerCustomerDetailComponent implements OnDestroy {

  private loadDepositProductsSubscription: Subscription;

  private loadLoanProductsSubscription: Subscription;

  private portraitSubscription: Subscription;

  portrait: Blob;

  customer$: Observable<Customer>;

  hasDepositProducts$: Observable<boolean>;

  hasLoanProducts$: Observable<boolean>;

  actions: Action[] = [
    { transactionType: 'ACCO', color: 'indigo-A400', icon: 'create', title: 'Open account', description: ''},
    { transactionType: 'ACCC', color: 'indigo-A400', icon: 'close', title: 'Close account', description: ''},
    { transactionType: 'ACCT', color: 'indigo-A400', icon: 'swap_horiz', title: 'Account transfer', description: ''},
    { transactionType: 'CDPT', color: 'indigo-A400', icon: 'arrow_forward', title: 'Cash deposit', description: ''},
    { transactionType: 'CWDL', color: 'indigo-A400', icon: 'arrow_back', title: 'Cash withdrawal', description: ''}
  ];

  constructor(private store: TellerStore, private customerService: CustomerService) {
    this.customer$ = store.select(fromTeller.getTellerSelectedCustomer)
      .filter(customer => !!customer);

    this.portraitSubscription = this.customer$
      .flatMap(customer => this.customerService.getPortrait(customer.identifier))
      .subscribe(portrait => this.portrait = portrait);

    this.hasDepositProducts$ = store.select(fromTeller.hasTellerCustomerDepositProducts);

    this.hasLoanProducts$ = store.select(fromTeller.hasTellerCustomerLoanProducts);

    this.loadDepositProductsSubscription = this.customer$
      .map(customer => new LoadAllDepositProductsAction(customer.identifier))
      .subscribe(this.store);

    this.loadLoanProductsSubscription = this.customer$
      .map(customer => new LoadAllLoanProductsAction(customer.identifier))
      .subscribe(this.store);
  }

  ngOnDestroy(): void {
    this.loadDepositProductsSubscription.unsubscribe();
    this.loadLoanProductsSubscription.unsubscribe();
    this.portraitSubscription.unsubscribe();
  }
}
