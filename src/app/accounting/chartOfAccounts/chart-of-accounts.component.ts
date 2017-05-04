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
import {ChartOfAccountEntry} from '../../../services/accounting/domain/chart-of-account-entry.model';
import {Observable} from 'rxjs/Observable';
import {AccountingStore} from '../store/index';
import * as fromAccounting from '../store';
import {LOAD_CHART_OF_ACCOUNTS} from '../store/ledger/ledger.actions';

@Component({
  templateUrl: './chart-of-accounts.component.html'
})
export class ChartOfAccountComponent implements OnInit{

  chartOfAccountEntries$: Observable<ChartOfAccountEntry[]>;

  loading$: Observable<boolean>;

  constructor(private store: AccountingStore){}

  ngOnInit(): void {
    this.chartOfAccountEntries$ = this.store.select(fromAccounting.getChartOfAccountEntries);

    this.loading$ = this.store.select(fromAccounting.getChartOfAccountLoading);

    this.store.dispatch({ type: LOAD_CHART_OF_ACCOUNTS });
  }

}
