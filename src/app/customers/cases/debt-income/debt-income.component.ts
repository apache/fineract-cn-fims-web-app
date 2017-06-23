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
import {CasesStore} from '../store/index';
import * as fromCases from '../store/index';
import {FimsCase} from '../store/model/fims-case.model';
import {Observable} from 'rxjs/Observable';
import {CreditWorthinessFactor} from '../../../../services/portfolio/domain/individuallending/credit-worthiness-factor.model';
import {CreditWorthinessSnapshot} from '../../../../services/portfolio/domain/individuallending/credit-worthiness-snapshot.model';
import * as fromCustomers from '../../store/index';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {TableData} from '../../../../common/data-table/data-table.component';

interface IncomeDebtOverview {
  debtTableData: TableData,
  incomeTableData: TableData,
  ratio: number,
  debtTotal: number,
  incomeTotal: number
}

@Component({
  templateUrl: './debt-income.component.html'
})
export class CaseDebtIncomeComponent implements OnInit {

  numberFormat: string = '2.2-2';

  columns: any[] = [
    { name: 'description', label: 'Description' },
    { name: 'amount', label: 'Amount' }
  ];

  customerOverview$: Observable<IncomeDebtOverview>;

  cosignerOverview$: Observable<IncomeDebtOverview>;

  constructor(private store: CasesStore) {
  }

  ngOnInit(): void {
    const selectedCustomer$: Observable<Customer> = this.store.select(fromCustomers.getSelectedCustomer);

    const snapshots$: Observable<CreditWorthinessSnapshot[]> = this.store.select(fromCases.getSelectedCase)
      .map((fimsCase: FimsCase) => fimsCase.parameters.creditWorthinessSnapshots);

    const combined$ = Observable.combineLatest(selectedCustomer$, snapshots$, (customer, snapshots) => ({
      customer,
      snapshots
    }));

    this.customerOverview$ = combined$
      .map(result => result.snapshots.find(snapshot => snapshot.forCustomer === result.customer.identifier))
      .map(snapshot => snapshot ? snapshot : this.mapEmptySnapshot())
      .map(snapshot => this.mapToOverview(snapshot));

    this.cosignerOverview$ = combined$
      .map(result => result.snapshots.find(snapshot => snapshot.forCustomer !== result.customer.identifier))
      .map(snapshot => snapshot ? snapshot : this.mapEmptySnapshot())
      .map(snapshot => this.mapToOverview(snapshot));
  }

  private mapEmptySnapshot(): CreditWorthinessSnapshot {
    return {
      forCustomer: '',
      incomeSources: [],
      debts: [],
      assets: []
    }
  }

  private mapToOverview(snapshot: CreditWorthinessSnapshot): IncomeDebtOverview {
    const debtTotal = this.sum(snapshot.debts);
    const incomeTotal = this.sum(snapshot.incomeSources);
    const ratio = this.divideIfNotZero(debtTotal, incomeTotal);
    return {
      debtTableData: this.mapToTableData(snapshot.debts),
      incomeTableData: this.mapToTableData(snapshot.incomeSources),
      debtTotal,
      incomeTotal,
      ratio
    }
  }

  mapToTableData(data: CreditWorthinessFactor[]): TableData {
    return {
      data,
      totalPages: 1,
      totalElements: data.length
    }
  }

  divideIfNotZero(numerator, denominator): number {
    if (denominator === 0 || isNaN(denominator)) {
      return null;
    } else {
      return numerator / denominator;
    }
  }

  sum(factors: CreditWorthinessFactor[]): number {
    return factors.reduce((acc, val) => acc + val.amount, 0);
  }

}
