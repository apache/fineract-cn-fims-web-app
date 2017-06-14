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

import {Action} from '@ngrx/store';
import {type} from '../../../util';
import {Ledger} from '../../../../services/accounting/domain/ledger.model';
import {Error} from '../../../../services/domain/error.model';
import {TrialBalance} from '../../../../services/accounting/domain/trial-balance.model';
import {RoutePayload} from '../../../../common/store/route-payload';
import {LedgerPage} from '../../../../services/accounting/domain/ledger-page.model';
import {ChartOfAccountEntry} from '../../../../services/accounting/domain/chart-of-account-entry.model';

export const LOAD_ALL_TOP_LEVEL = type('[Ledger] Load All Top Level');
export const LOAD_ALL_TOP_LEVEL_COMPLETE = type('[Ledger] Load All Top Level Complete');

export const LOAD = type('[Ledger] Load');
export const SELECT = type('[Ledger] Select');

export const CREATE = type('[Ledger] Create');
export const CREATE_SUCCESS = type('[Ledger] Create Success');
export const CREATE_FAIL = type('[Ledger] Create Fail');

export const CREATE_SUB_LEDGER = type('[Ledger] Create Subledger');
export const CREATE_SUB_LEDGER_SUCCESS = type('[Ledger] Create Subledger Success');
export const CREATE_SUB_LEDGER_FAIL = type('[Ledger] Create Subledger Fail');


export const UPDATE = type('[Ledger] Update');
export const UPDATE_SUCCESS = type('[Ledger] Update Success');
export const UPDATE_FAIL = type('[Ledger] Update Fail');

export const DELETE = type('[Ledger] Delete');
export const DELETE_SUCCESS = type('[Ledger] Delete Success');
export const DELETE_FAIL = type('[Ledger] Delete Fail');

export const LOAD_TRIAL_BALANCE = type('[Ledger] Load Trial Balance');
export const LOAD_TRIAL_BALANCE_COMPLETE = type('[Ledger] Load Trial Balance Complete');

export const LOAD_CHART_OF_ACCOUNTS = type('[Ledger] Load Chart Of Accounts');
export const LOAD_CHART_OF_ACCOUNTS_COMPLETE = type('[Ledger] Load Chart Of Accounts Complete');

export const RESET_FORM = type('[Ledger] Reset Form');

export interface CreateSubLedgerPayload extends RoutePayload{
  parentLedgerId: string;
  ledger: Ledger;
}

export interface LedgerRoutePayload extends RoutePayload{
  ledger: Ledger
}

export class LoadAllTopLevel implements Action {
  readonly type = LOAD_ALL_TOP_LEVEL;

  constructor() { }
}

export class LoadAllTopLevelComplete implements Action {
  readonly type = LOAD_ALL_TOP_LEVEL_COMPLETE;

  constructor(public payload: Ledger[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: Ledger) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: string) { }
}

export class CreateLedgerAction implements Action {
  readonly type = CREATE;

  constructor(public payload: LedgerRoutePayload) { }
}

export class CreateLedgerSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: LedgerRoutePayload) { }
}

export class CreateLedgerFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class CreateSubLedgerAction implements Action {
  readonly type = CREATE_SUB_LEDGER;

  constructor(public payload: CreateSubLedgerPayload) { }
}

export class CreateSubLedgerSuccessAction implements Action {
  readonly type = CREATE_SUB_LEDGER_SUCCESS;

  constructor(public payload: CreateSubLedgerPayload) { }
}

export class CreateSubLedgerFailAction implements Action {
  readonly type = CREATE_SUB_LEDGER_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateLedgerAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: LedgerRoutePayload) { }
}

export class UpdateLedgerSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: LedgerRoutePayload) { }
}

export class UpdateLedgerFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class DeleteLedgerAction implements Action {
  readonly type = DELETE;

  constructor(public payload: LedgerRoutePayload) { }
}

export class DeleteLedgerSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: LedgerRoutePayload) { }
}

export class DeleteLedgerFailAction implements Action {
  readonly type = DELETE_FAIL;

  constructor(public payload: Error) { }
}

export class LoadTrialBalanceAction implements Action {
  readonly type = LOAD_TRIAL_BALANCE;

  constructor(public payload: boolean) { }
}

export class LoadTrialBalanceActionComplete implements Action {
  readonly type = LOAD_TRIAL_BALANCE_COMPLETE;

  constructor(public payload: TrialBalance) { }
}

export class LoadChartOfAccountsAction implements Action {
  readonly type = LOAD_CHART_OF_ACCOUNTS;

  constructor() { }
}

export class LoadChartOfAccountsActionComplete implements Action {
  readonly type = LOAD_CHART_OF_ACCOUNTS_COMPLETE;

  constructor(public payload: ChartOfAccountEntry[]) { }
}

export class ResetLedgerFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAllTopLevel
  | LoadAllTopLevelComplete
  | LoadAction
  | SelectAction
  | CreateLedgerAction
  | CreateLedgerSuccessAction
  | CreateLedgerFailAction
  | CreateSubLedgerAction
  | CreateSubLedgerSuccessAction
  | CreateSubLedgerFailAction
  | UpdateLedgerAction
  | UpdateLedgerSuccessAction
  | UpdateLedgerFailAction
  | DeleteLedgerAction
  | DeleteLedgerSuccessAction
  | DeleteLedgerFailAction
  | LoadTrialBalanceAction
  | LoadTrialBalanceActionComplete
  | LoadChartOfAccountsAction
  | LoadChartOfAccountsActionComplete
  | ResetLedgerFormAction;
