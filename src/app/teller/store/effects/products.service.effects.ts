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

import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {DepositAccountService} from '../../../../services/depositAccount/deposit-account.service';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {Observable} from 'rxjs/Observable';
import * as tellerActions from '../teller.actions';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';

@Injectable()
export class TellerProductsApiEffects {

  constructor(private actions$: Actions, private depositService: DepositAccountService, private portfolioService: PortfolioService) {}

  @Effect()
  loadAllDepositProducts$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOAD_ALL_DEPOSIT_PRODUCTS)
    .map((action: tellerActions.LoadAllDepositProductsAction) => action.payload)
    .mergeMap(customerId =>
      this.depositService.fetchProductInstances(customerId)
        .map(productInstances => new tellerActions.LoadAllDepositProductsSuccessAction(productInstances))
        .catch(() => of(new tellerActions.LoadAllDepositProductsSuccessAction([])))
    );

  @Effect()
  loadAllLoanProducts$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOAD_ALL_LOAN_PRODUCTS)
    .map((action: tellerActions.LoadAllLoanProductsAction) => action.payload)
    .mergeMap(customerId =>
      this.portfolioService.getAllCasesForCustomer(customerId)
        .map(casePage => new tellerActions.LoadAllLoanProductsSuccessAction(casePage.elements))
        .catch((error) => of(new tellerActions.LoadAllLoanProductsSuccessAction([])))
    );
}
