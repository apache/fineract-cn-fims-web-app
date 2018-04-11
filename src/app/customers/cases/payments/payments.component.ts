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
import {PlannedPaymentPage} from '../../../services/portfolio/domain/individuallending/planned-payment-page.model';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {SEARCH} from '../store/payments/payment.actions';
import {PlannedPayment} from '../../../services/portfolio/domain/individuallending/planned-payment.model';
import {CostComponent} from '../../../services/portfolio/domain/cost-component.model';
import {ChargeName} from '../../../services/portfolio/domain/individuallending/charge-name.model';
import {todayAsISOString} from '../../../services/domain/date.converter';
import {FimsCase} from '../../../services/portfolio/domain/fims-case.model';

interface CostComponents {
  [id: string]: CostComponent;
}

interface PaymentRow {
  date?: string;
  payment?: number;
  interest?: number;
  principal?: number;
  balance: number;
}

@Component({
  templateUrl: './payments.component.html'
})
export class CasePaymentsComponent implements OnInit, OnDestroy {

  private caseSubscription: Subscription;

  startDate: string = todayAsISOString();

  caseInstance: FimsCase;

  rows: Observable<PaymentRow[]>;

  columns: Observable<ChargeName[]>;

  constructor(private casesStore: CasesStore) {}

  private createRows(plannedPayments: PlannedPayment[]): PaymentRow[] {
    const rows: PaymentRow[] = [];

    plannedPayments.forEach((plannedPayment, index) => {
      const interest = this.getChargeAmount(plannedPayment.payment.costComponents, 'repay-interest');
      const principal = this.getChargeAmount(plannedPayment.payment.costComponents, 'repay-principal');
      const payment = plannedPayment.payment.balanceAdjustments.ey * -1;
      const balance = plannedPayment.balances.clp;

      if (index === 0) {
        rows.push({
          balance
        });

        return;
      }

      rows.push({
        date: plannedPayment.payment.date,
        payment,
        interest,
        principal,
        balance
      });
    });

    return rows;
  }

  private getChargeAmount(costComponents: CostComponent[], chargeIdentifier: string): number {
    const foundComponent = costComponents.find(component => component.chargeIdentifier === chargeIdentifier);

    if (foundComponent) {
      return foundComponent.amount;
    }

    return 0;
  };

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

  fetchPayments(startDate?: string): void {
    this.casesStore.dispatch({ type: SEARCH, payload: {
      productIdentifier: this.caseInstance.productIdentifier,
      caseIdentifier: this.caseInstance.identifier,
      initialDisbursalDate: startDate
    }});
  }
}
