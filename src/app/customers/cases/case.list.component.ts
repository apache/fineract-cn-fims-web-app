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
import {ActivatedRoute, Router} from '@angular/router';
import {TableData} from '../../../common/data-table/data-table.component';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Case} from '../../../services/portfolio/domain/case.model';
import {Customer} from '../../../services/customer/domain/customer.model';
import * as fromCases from './store/index';
import * as fromCustomers from '../store';
import {CasesStore} from './store/index';
import {Observable, Subscription} from 'rxjs';
import {SEARCH} from './store/case.actions';

@Component({
  templateUrl: './case.list.component.html'
})
export class CaseListComponent implements OnInit{

  private customerSubscription: Subscription;

  private customer: Customer;

  casesData$: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
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

    this.customerSubscription = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => {
        this.customer = customer;
        this.fetchCases();
      });
  }

  fetchCases(fetchRequest?: FetchRequest): void{
    this.casesStore.dispatch({ type: SEARCH, payload: {
      customerId: this.customer.identifier,
      fetchRequest: fetchRequest
    }});
  }

  rowSelect(caseInstance: Case): void{
    this.router.navigate(['products', caseInstance.productIdentifier, 'detail', caseInstance.identifier], { relativeTo: this.route })
  }

}
