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
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as ledgerActions from '../ledger.actions';
import {AccountingService} from '../../../../../services/accounting/accounting.service';
import {ChartOfAccountEntry} from '../../../../../services/accounting/domain/chart-of-account-entry.model';

@Injectable()
export class LedgerApiEffects {

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(ledgerActions.LOAD_ALL_TOP_LEVEL)
    .debounceTime(300)
    .switchMap(() => {
      const nextSearch$ = this.actions$.ofType(ledgerActions.LOAD_ALL_TOP_LEVEL).skip(1);

      return this.accountingService.fetchLedgers()
        .takeUntil(nextSearch$)
        .map(ledgerPage => ledgerPage.ledgers)
        .map(ledgers => new ledgerActions.LoadAllTopLevelComplete(ledgers))
        .catch(() => of(new ledgerActions.LoadAllTopLevelComplete([])));
    });

  @Effect()
  createLedger$: Observable<Action> = this.actions$
    .ofType(ledgerActions.CREATE)
    .map((action: ledgerActions.CreateLedgerAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.createLedger(payload.ledger)
        .map(() => new ledgerActions.CreateLedgerSuccessAction(payload))
        .catch((error) => of(new ledgerActions.CreateLedgerFailAction(error)))
    );

  @Effect()
  createSubLedger$: Observable<Action> = this.actions$
    .ofType(ledgerActions.CREATE_SUB_LEDGER)
    .map((action: ledgerActions.CreateSubLedgerAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.addSubLedger(payload.parentLedgerId, payload.ledger)
        .map(() => new ledgerActions.CreateSubLedgerSuccessAction(payload))
        .catch((error) => of(new ledgerActions.CreateSubLedgerFailAction(error)))
    );

  @Effect()
  updateLedger$: Observable<Action> = this.actions$
    .ofType(ledgerActions.UPDATE)
    .map((action: ledgerActions.UpdateLedgerAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.modifyLedger(payload.ledger)
          .map(() => new ledgerActions.UpdateLedgerSuccessAction(payload))
          .catch((error) => of(new ledgerActions.UpdateLedgerFailAction(error)))
    );

  @Effect()
  deleteLedger$: Observable<Action> = this.actions$
    .ofType(ledgerActions.DELETE)
    .map((action: ledgerActions.DeleteLedgerAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.deleteLedger(payload.ledger.identifier)
        .map(() => new ledgerActions.DeleteLedgerSuccessAction(payload))
        .catch((error) => of(new ledgerActions.DeleteLedgerFailAction(error)))
    );

  @Effect()
  loadTrialBalance$: Observable<Action> = this.actions$
    .ofType(ledgerActions.LOAD_TRIAL_BALANCE)
    .map((action: ledgerActions.LoadTrialBalanceAction) => action.payload)
    .mergeMap(includeEmpty =>
      this.accountingService.getTrialBalance(includeEmpty)
        .map(trialBalance => new ledgerActions.LoadTrialBalanceActionComplete(trialBalance))
        .catch(() => of(new ledgerActions.LoadTrialBalanceActionComplete(null)))
    );

  @Effect()
  loadChartOfAccounts$: Observable<Action> = this.actions$
    .ofType(ledgerActions.LOAD_CHART_OF_ACCOUNTS)
    .mergeMap(() =>
      this.accountingService.getChartOfAccounts()
        .map(chartOfAccountEntries => new ledgerActions.LoadChartOfAccountsActionComplete(chartOfAccountEntries))
        .catch(() => of(new ledgerActions.LoadChartOfAccountsActionComplete([])))
    );

}
