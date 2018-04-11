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
import {Component, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TableData} from '../../common/data-table/data-table.component';
import * as fromAccounting from '../store/index';
import {AccountingStore} from '../store/index';
import {PaymentSearchPayload, SEARCH} from '../store/payroll/payment.actions';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {PayrollCollectionHistory} from '../../services/payroll/domain/payroll-collection-history.model';
import {SelectAction} from '../store/payroll/payroll-collection.actions';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './payments.list.component.html'
})
export class PaymentsListComponent implements OnDestroy {

  private actionsSubscription: Subscription;

  selectedPayrollCollection$: Observable<PayrollCollectionHistory>;

  paymentData$: Observable<TableData>;

  columns: any[] = [
    { name: 'customerIdentifier', label: 'Member ID' },
    { name: 'employer', label: 'Employer' },
    { name: 'salary', label: 'Salary' }
  ];

  constructor(private route: ActivatedRoute, private store: AccountingStore) {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.paymentData$ = this.store.select(fromAccounting.getPayrollPaymentSearchResults);

    this.selectedPayrollCollection$ = this.store.select(fromAccounting.getSelectedPayrollCollection)
      .do((payrollCollection: PayrollCollectionHistory) => this.fetchPayments(payrollCollection.identifier));
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  fetchPayments(payrollIdentifier: string, fetchRequest?: FetchRequest): void {
    const payload: PaymentSearchPayload = {
      payrollIdentifier,
      fetchRequest
    };

    this.store.dispatch({
      type: SEARCH,
      payload
    });
  }

}
