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
import {DepositAccountService} from '../../../../services/depositAccount/deposit-account.service';
import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as dividendActions from '../dividend.actions';

@Injectable()
export class DepositProductDividendApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(dividendActions.LOAD_ALL)
    .switchMap((action) => {
      return this.depositService.fetchDividendDistributions(action.payload)
        .map(dividendDistributions => new dividendActions.LoadAllCompleteAction(dividendDistributions))
        .catch(() => of(new dividendActions.LoadAllCompleteAction([])));
    });

  @Effect()
  createDividendDistribution$: Observable<Action> = this.actions$
    .ofType(dividendActions.CREATE)
    .map((action: dividendActions.CreateDividendDistributionAction) => action.payload)
    .mergeMap(payload =>
      this.depositService.distributeDividend(payload.productDefinitionId, payload.dividendDistribution)
        .map(() => new dividendActions.CreateDividendDistributionSuccessAction(payload))
        .catch((error) => of(new dividendActions.CreateDividendDistributionFailAction(error)))
    );

  constructor(private actions$: Actions, private depositService: DepositAccountService) {
  }

}
