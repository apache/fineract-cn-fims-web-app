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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TableData} from '../../common/data-table/data-table.component';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {Case} from '../../services/portfolio/domain/case.model';
import {Customer} from '../../services/customer/domain/customer.model';
import * as fromCases from './store/index';
import {CasesStore} from './store/index';
import * as fromCustomers from '../store';
import * as fromRoot from '../../store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {SEARCH} from './store/case.actions';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';

@Component({
  templateUrl: './case.list.component.html'
})
export class CaseListComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  private customer: Customer;

  casesData$: Observable<TableData>;

  canAdd$: Observable<boolean>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'productIdentifier', label: 'Loan product id' },
    { name: 'parameters', label: 'Principal', format: v => v.maximumBalance },
    { name: 'interest', label: 'Interest' },
    { name: 'currentState', label: 'Current status' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.casesData$ = this.casesStore.select(fromCases.getCaseSearchResults)
      .map(casePage => ({
        totalElements: casePage.totalElements,
        totalPages: casePage.totalPages,
        data: casePage.cases
      }));

    const customer$ = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .filter(customer => !!customer);

    this.customerSubscription = customer$
      .subscribe(customer => {
        this.customer = customer;
        this.fetchCases();
      });

    this.canAdd$ = Observable.combineLatest(
      this.casesStore.select(fromRoot.getPermissions),
      customer$,
      (permissions, customer: Customer) => ({
        hasPermission: this.hasChangePermission(permissions),
        isCustomerActive: customer.currentState === 'ACTIVE'
      }))
      .map(result => result.hasPermission && result.isCustomerActive);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  fetchCases(fetchRequest?: FetchRequest): void {
    this.casesStore.dispatch({ type: SEARCH, payload: {
      customerId: this.customer.identifier,
      fetchRequest
    }});
  }

  rowSelect(caseInstance: Case): void {
    this.router.navigate(['products', caseInstance.productIdentifier, 'detail', caseInstance.identifier], { relativeTo: this.route });
  }

  private hasChangePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
        permission.id === 'portfolio_cases' &&
        permission.accessLevel === 'CHANGE'
      ).length > 0;
  }

}
