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

@Component({
  templateUrl: './payments.component.html'
})
export class CasePaymentsComponent implements OnInit, OnDestroy{

  private caseSubscription: Subscription;

  caseInstance: Case;

  paymentPage: Observable<PlannedPaymentPage>;

  columns: any = [];

  constructor(private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.paymentPage = this.casesStore.select(fromCases.getCasePaymentSearchResults)
      .map(paymentsPage => ({
        elements: paymentsPage.payments,
        totalElements: paymentsPage.totalElements,
        totalPages: paymentsPage.totalPages
      }));

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
