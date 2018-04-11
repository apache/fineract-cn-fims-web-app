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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import * as payrollActions from '../payroll-collection.actions';
import {CreateSheetPayload} from '../payroll-collection.actions';
import * as paymentActions from '../payment.actions';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import {CreateResourceSuccessPayload} from '../../../../common/store/resource.reducer';
import {emptySearchResult} from '../../../../common/store/search.reducer';
import {PayrollService} from '../../../../services/payroll/payroll.service';

@Injectable()
export class PayrollCollectionApiEffects {

  @Effect()
  loadAllCollections$: Observable<Action> = this.actions$
    .ofType(payrollActions.LOAD_ALL_COLLECTIONS)
    .switchMap(() => this.payrollService.fetchDistributionHistory()
      .map(payrolls => new payrollActions.LoadAllCompleteAction(payrolls))
      .catch(() => of(new payrollActions.LoadAllCompleteAction([])))
    );

  @Effect()
  createSheet$: Observable<Action> = this.actions$
    .ofType(payrollActions.CREATE)
    .map((action: payrollActions.CreateAction) => action.payload)
    .switchMap(payload => this.payrollService.distribute(payload.sheet)
      .map(() => new payrollActions.CreateSuccessAction(this.map(payload)))
      .catch(error => of(new payrollActions.CreateFailAction(error)))
    );

  @Effect()
  searchPayments$: Observable<Action> = this.actions$
    .ofType(paymentActions.SEARCH)
    .map((action: paymentActions.SearchAction) => action.payload)
    .mergeMap(payload =>
      this.payrollService.fetchPayments(payload.payrollIdentifier, payload.fetchRequest)
        .map(payrollPaymentPage => new paymentActions.SearchCompleteAction({
          elements: payrollPaymentPage.payrollPayments,
          totalElements: payrollPaymentPage.totalElements,
          totalPages: payrollPaymentPage.totalPages
        }))
        .catch(() => of(new paymentActions.SearchCompleteAction(emptySearchResult())))
    );

  private map(payload: CreateSheetPayload): CreateResourceSuccessPayload {
    return {
      resource: {
        identifier: Date.now().toString(),
        sourceAccountNumber: payload.sheet.sourceAccountNumber,
        createdBy: '',
        createdOn: new Date().toISOString()
      },
      activatedRoute: payload.activatedRoute
    };
  }

  constructor(private actions$: Actions, private payrollService: PayrollService) {}
}
