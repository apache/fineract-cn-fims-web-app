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
import {Observable} from 'rxjs';
import * as fromAccounting from '../store/index';
import {AccountingStore} from '../store/index';
import {TableData, TableFetchRequest} from '../../../common/data-table/data-table.component';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {SEARCH} from '../store/ledger/transaction-type/transaction-type.actions';
import {TransactionType} from '../../../services/accounting/domain/transaction-type.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './transaction-types.list.component.html'
})
export class TransactionTypeListComponent implements OnInit {

  transactionTypesData$: Observable<TableData>;

  loading$: Observable<boolean>;

  columns: any[] = [
    { name: 'code', label: 'Code' },
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' }
  ];

  private searchTerm: string;

  private lastFetchRequest: FetchRequest = {};

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit(): void {
    this.transactionTypesData$ = this.store.select(fromAccounting.getTransactionTypeSearchResults)
      .map(transactionTypePage => ({
        data: transactionTypePage.transactionTypes,
        totalElements: transactionTypePage.totalElements,
        totalPages: transactionTypePage.totalPages
      }));

    this.loading$ = this.store.select(fromAccounting.getTransactionTypeSearchLoading);

    this.fetchTransactionTypes();
  }

  rowSelect(transactionType: TransactionType): void {
    this.router.navigate(['edit', transactionType.code], { relativeTo: this.route })
  }

  fetchTransactionTypes(fetchRequest?: TableFetchRequest): void {
    if(fetchRequest) {
      this.lastFetchRequest = fetchRequest;
    }

    this.lastFetchRequest.searchTerm = this.searchTerm;

    this.store.dispatch({ type: SEARCH, payload: this.lastFetchRequest });
  }
}
