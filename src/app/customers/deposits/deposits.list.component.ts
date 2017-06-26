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

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Subscription} from 'rxjs/Subscription';
import {TableData} from '../../../common/data-table/data-table.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DepositsStore} from './store/index';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {SEARCH} from './store/deposit.actions';
import {ProductInstance} from '../../../services/depositAccount/domain/instance/product-instance.model';
import * as fromDeposits from './store/index';
import * as fromCustomers from '../store';


@Component({
  templateUrl: './deposits.list.component.html'
})
export class DepositsListComponent implements OnInit {

  private customerSubscription: Subscription;

  private customer: Customer;

  productInstancesData$: Observable<TableData>;

  columns: any[] = [
    { name: 'productIdentifier', label: 'Deposit product' },
    { name: 'accountIdentifier', label: 'Account identifier' },
    { name: 'balance', label: 'Balance', numeric: true, format: v => v.toFixed(2) },
    { name: 'state', label: 'State' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private depositsStore: DepositsStore) {}

  ngOnInit(): void {
    this.productInstancesData$ = this.depositsStore.select(fromDeposits.getDepositSearchResults)
      .map(depositsPage => ({
        totalElements: depositsPage.totalElements,
        totalPages: depositsPage.totalPages,
        data: depositsPage.deposits
      }));

    this.customerSubscription = this.depositsStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => {
        this.customer = customer;
        this.fetchProductInstances();
      });
  }

  fetchProductInstances(fetchRequest?: FetchRequest): void{
    this.depositsStore.dispatch({ type: SEARCH, payload: {
      customerId: this.customer.identifier,
      fetchRequest: fetchRequest
    }});
  }

  rowSelect(productInstance: ProductInstance): void{
    this.router.navigate(['detail', productInstance.accountIdentifier], { relativeTo: this.route })
  }
}
