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
import {Case} from '../../../../services/portfolio/domain/case.model';
import {PlannedPaymentPage} from '../../../../services/portfolio/domain/individuallending/planned-payment-page.model';
import {CasesStore} from '../store/index';
import * as fromCases from '../store/index';
import {Observable, Subscription} from 'rxjs';
import {SEARCH} from '../store/payments/payment.actions';
import {PlannedPayment} from '../../../../services/portfolio/domain/individuallending/planned-payment.model';
import {ITdDataTableColumn} from '@covalent/core';
import {CostComponent} from '../../../../services/portfolio/domain/individuallending/cost-component.model';
import {ChargeName} from '../../../../services/portfolio/domain/individuallending/charge-name.model';
import {FimsCase} from '../store/model/fims-case.model';
import {todayAsISOString} from '../../../../services/domain/date.converter';

interface CostComponents {
  [id: string]: CostComponent
}

interface PaymentRow {
  interestRate: number;
  remainingPrincipal: number;
  date: string;
  costComponents: CostComponents
}

@Component({
  templateUrl: './payments.component.html'
})
export class CasePaymentsComponent implements OnInit, OnDestroy{

  private caseSubscription: Subscription;

  startDate: string = todayAsISOString();

  caseInstance: FimsCase;

  rows: Observable<PaymentRow[]>;

  columns: Observable<ChargeName[]>;

  constructor(private casesStore: CasesStore) {}

  private createRows(payments: PlannedPayment[]): PaymentRow[] {
    let rows: PaymentRow[] = [];

    for(let payment of payments) {
      const costComponents: CostComponents = payment.costComponents.reduce((entities: { [id: string]: CostComponent }, costComponent: CostComponent) => {
        return Object.assign(entities, {
          [costComponent.chargeIdentifier]: costComponent
        });
      }, {});

      rows.push({
        date: payment.date,
        interestRate: payment.interestRate,
        remainingPrincipal: payment.remainingPrincipal,
        costComponents: costComponents
      })
    }

    return rows;
  }

  ngOnInit(): void {
    this.columns = this.casesStore.select(fromCases.getSearchCasePaymentPage)
      .map((page: PlannedPaymentPage) => page.chargeNames);

    this.rows = this.casesStore.select(fromCases.getSearchCasePaymentPage)
      .map((page: PlannedPaymentPage) => this.createRows(page.elements));

    this.caseSubscription = this.casesStore.select(fromCases.getSelectedCase)
      .subscribe(caseInstance => {
        this.caseInstance = caseInstance;
        this.fetchPayments();
      });
  }

  ngOnDestroy(): void {
    this.caseSubscription.unsubscribe();
  }

  fetchPayments(startDate?: string): void{
    this.casesStore.dispatch({ type: SEARCH, payload: {
      productIdentifier: this.caseInstance.productIdentifier,
      caseIdentifier: this.caseInstance.identifier,
      initialDisbursalDate: startDate
    }});
  }
}
