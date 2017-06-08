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
import {Observable} from 'rxjs/Observable';
import {TableData} from '../../../../common/data-table/data-table.component';
import {LOAD_ALL} from '../../store/identityCards/identity-cards.actions';
import {IdentificationCard} from '../../../../services/customer/domain/identification-card.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './identity-card.list.component.html'
})
export class CustomerIdentityCardListComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  identityCardData$: Observable<TableData>;

  columns: any[] = [
    { name: 'number', label: 'Number' },
    { name: 'type', label: 'Type' },
    { name: 'issuer', label: 'Issuer' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: CustomersStore) {}

  ngOnInit(): void {
    this.identityCardData$ = this.store.select(fromCustomers.getAllCustomerIdentificationCardEntities)
      .map(entities => ({
        data: entities,
        totalElements: entities.length,
        totalPages: 1
      }));

    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => {
        this.store.dispatch({ type: LOAD_ALL, payload: customer.identifier})
      });
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  rowSelect(identificationCard: IdentificationCard): void {
    this.router.navigate(['detail', identificationCard.number], { relativeTo: this.route });
  }

}
