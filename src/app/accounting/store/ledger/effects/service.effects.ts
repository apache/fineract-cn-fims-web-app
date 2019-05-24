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
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as ledgerActions from '../ledger.actions';
import { AccountingService } from '../../../../services/accounting/accounting.service';
import { map, debounceTime, switchMap, mergeMap, skip, takeUntil, catchError } from 'rxjs/operators';

@Injectable()
export class LedgerApiEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.LOAD_ALL_TOP_LEVEL),
      debounceTime(300),
      switchMap(() => {
        const nextSearch$ = this.actions$.pipe(ofType(ledgerActions.LOAD_ALL_TOP_LEVEL),(skip(1)));

        return this.accountingService.fetchLedgers()
          .pipe(takeUntil(nextSearch$),
            map(ledgerPage => ledgerPage.ledgers),
            map(ledgers => new ledgerActions.LoadAllTopLevelComplete(ledgers)),
            catchError(() => of(new ledgerActions.LoadAllTopLevelComplete([]))));
      }));

  @Effect()
  createLedger$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.CREATE),
      map((action: ledgerActions.CreateLedgerAction) => action.payload),
      mergeMap(payload =>
        this.accountingService.createLedger(payload.ledger).pipe(
          map(() => new ledgerActions.CreateLedgerSuccessAction(payload)),
          catchError((error) => of(new ledgerActions.CreateLedgerFailAction(error))))
      ));

  @Effect()
  createSubLedger$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.CREATE_SUB_LEDGER),
      map((action: ledgerActions.CreateSubLedgerAction) => action.payload),
      mergeMap(payload =>
        this.accountingService.addSubLedger(payload.parentLedgerId, payload.ledger).pipe(
          map(() => new ledgerActions.CreateSubLedgerSuccessAction(payload)),
          catchError((error) => of(new ledgerActions.CreateSubLedgerFailAction(error))))
      ));

  @Effect()
  updateLedger$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.UPDATE),
      map((action: ledgerActions.UpdateLedgerAction) => action.payload),
      mergeMap(payload =>
        this.accountingService.modifyLedger(payload.ledger).pipe(
          map(() => new ledgerActions.UpdateLedgerSuccessAction(payload)),
          catchError((error) => of(new ledgerActions.UpdateLedgerFailAction(error))))
      ));

  @Effect()
  deleteLedger$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.DELETE),
      map((action: ledgerActions.DeleteLedgerAction) => action.payload),
      mergeMap(payload =>
        this.accountingService.deleteLedger(payload.ledger.identifier).pipe(
          map(() => new ledgerActions.DeleteLedgerSuccessAction(payload)),
          catchError((error) => of(new ledgerActions.DeleteLedgerFailAction(error))))
      ));

  @Effect()
  loadTrialBalance$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.LOAD_TRIAL_BALANCE),
      map((action: ledgerActions.LoadTrialBalanceAction) => action.payload),
      mergeMap(includeEmpty =>
        this.accountingService.getTrialBalance(includeEmpty).pipe(
          map(trialBalance => new ledgerActions.LoadTrialBalanceActionComplete(trialBalance)),
          catchError(() => of(new ledgerActions.LoadTrialBalanceActionComplete(null))))
      ));

  @Effect()
  loadChartOfAccounts$: Observable<Action> = this.actions$
    .pipe(ofType(ledgerActions.LOAD_CHART_OF_ACCOUNTS),
      mergeMap(() =>
        this.accountingService.getChartOfAccounts().pipe(
          map(chartOfAccountEntries => new ledgerActions.LoadChartOfAccountsActionComplete(chartOfAccountEntries)),
          catchError(() => of(new ledgerActions.LoadChartOfAccountsActionComplete([]))))
      ));

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

}
