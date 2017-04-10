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

import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as paymentActions from '../payment.actions';
import {of} from 'rxjs/observable/of';
import {PortfolioService} from '../../../../../../services/portfolio/portfolio.service';

@Injectable()
export class CasePaymentsApiEffects {

  constructor(private actions$: Actions, private portfolioService: PortfolioService) {}

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(paymentActions.SEARCH)
    .debounceTime(300)
    .map((action: paymentActions.SearchAction) => action.payload)
    .switchMap(payload => {
      const nextSearch$ = this.actions$.ofType(paymentActions.SEARCH).skip(1);

      return this.portfolioService.getPaymentScheduleForCase(payload.productIdentifier, payload.caseIdentifier, payload.initialDisbursalDate)
        .takeUntil(nextSearch$)
        .map(paymentsPage => new paymentActions.SearchCompleteAction(paymentsPage))
        .catch(() => of(new paymentActions.SearchCompleteAction({
          totalElements: 0,
          totalPages: 0,
          elements: [],
          chargeNames: []
        })));
    });
}
