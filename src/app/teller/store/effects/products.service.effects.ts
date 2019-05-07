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
import {DepositAccountService} from '../../../services/depositAccount/deposit-account.service';
import {PortfolioService} from '../../../services/portfolio/portfolio.service';
import {Observable, of} from 'rxjs';
import * as tellerActions from '../teller.actions';
import {Action} from '@ngrx/store';
import {map, mergeMap, catchError} from 'rxjs/operators';

@Injectable()
export class TellerProductsApiEffects {

  @Effect()
  loadAllDepositProducts$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOAD_ALL_DEPOSIT_PRODUCTS).pipe(
    map((action: tellerActions.LoadAllDepositProductsAction) => action.payload),
    mergeMap(customerId =>
      this.depositService.fetchProductInstances(customerId).pipe(
        map(productInstances => new tellerActions.LoadAllDepositProductsSuccessAction(productInstances)),
        catchError(() => of(new tellerActions.LoadAllDepositProductsSuccessAction([]))))
    ));

  @Effect()
  loadAllLoanProducts$: Observable<Action> = this.actions$
    .ofType(tellerActions.LOAD_ALL_LOAN_PRODUCTS).pipe(
    map((action: tellerActions.LoadAllLoanProductsAction) => action.payload),
    mergeMap(customerId =>
      this.portfolioService.getAllCasesForCustomer(customerId).pipe(
        map(casePage => new tellerActions.LoadAllLoanProductsSuccessAction(casePage.elements)),
        catchError((error) => of(new tellerActions.LoadAllLoanProductsSuccessAction([]))))
    ));

  constructor(private actions$: Actions, private depositService: DepositAccountService, private portfolioService: PortfolioService) {}
}
