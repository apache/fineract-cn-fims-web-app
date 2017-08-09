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
import * as fromDepositAccounts from '../../store/index';
import {DepositAccountStore} from '../../store/index';
import {Observable} from 'rxjs/Observable';
import {TableData} from '../../../common/data-table/data-table.component';
import {DatePipe} from '@angular/common';
import {LOAD_ALL} from '../../store/dividends/dividend.actions';
import {Subscription} from 'rxjs/Subscription';

@Component({
  providers: [DatePipe],
  templateUrl: './dividends.component.html'
})
export class DepositProductDividendsComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  private productIdentifer: string;

  dividendData$: Observable<TableData>;

  columns: any[] = [
    { name: 'dueDate', label: 'Due date', format: value => this.datePipe.transform(value, 'shortDate') },
    { name: 'dividendRate', label: 'Dividend rate' }
  ];

  constructor(private store: DepositAccountStore, private datePipe: DatePipe) {}

  ngOnInit() {
    this.productSubscription = this.store.select(fromDepositAccounts.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => this.productIdentifer = product.identifier);

    this.dividendData$ = this.store.select(fromDepositAccounts.getDividends)
      .map(dividends => ({
        data: dividends,
        totalElements: dividends.length,
        totalPages: 1
      }));

    this.store.dispatch({
      type: LOAD_ALL,
      payload: this.productIdentifer
    })
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
