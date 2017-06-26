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

import {type} from '../../util';
import {Action} from '@ngrx/store';
import {LoadResourcePayload, SelectResourcePayload} from '../../../common/store/resource.reducer';
import {ProductInstance} from '../../../services/depositAccount/domain/instance/product-instance.model';
import {Case} from '../../../services/portfolio/domain/case.model';
import {RoutePayload} from '../../../common/store/route-payload';
import {Teller} from '../../../services/teller/domain/teller.model';

export const UNLOCK_DRAWER = type('[Teller] Unlock Drawer');
export const UNLOCK_DRAWER_SUCCESS = type('[Teller] Unlock Drawer Success');
export const UNLOCK_DRAWER_FAIL = type('[Teller] Unlock Drawer Fail');
export const LOCK_DRAWER = type('[Teller] Lock Drawer');
export const LOCK_DRAWER_SUCCESS = type('[Teller] Lock Drawer Success');

export const LOAD_CUSTOMER = type('[Teller Customer] Load');
export const SELECT_CUSTOMER = type('[Teller Customer] Select');

export const LOAD_ALL_DEPOSIT_PRODUCTS = type('[Teller Customer] Deposit Product Load All');
export const LOAD_ALL_DEPOSIT_PRODUCTS_SUCCESS = type('[Teller Customer] Deposit Product Load All Success');
export const LOAD_ALL_LOAN_PRODUCTS = type('[Teller Customer] Loan Product Load All');
export const LOAD_ALL_LOAN_PRODUCTS_SUCCESS = type('[Teller Customer] Loan Product Load All Success');

export const CONFIRM_TRANSACTION = type('[Teller Customer] Confirm Transaction');
export const CONFIRM_TRANSACTION_SUCCESS = type('[Teller Customer] Confirm Transaction Success');
export const CONFIRM_TRANSACTION_FAIL = type('[Teller Customer] Confirm Transaction Fail');

export interface UnlockDrawerPayload {
  tellerCode: string;
  employeeId: string;
  password: string;
}

export interface LockDrawerPayload {
  tellerCode: string;
}

export interface ConfirmTransactionPayload extends RoutePayload {
  tellerCode: string;
  tellerTransactionIdentifier: string;
  command: string
}

export class UnlockDrawerAction implements Action {
  readonly type = UNLOCK_DRAWER;

  constructor(public payload: UnlockDrawerPayload) { }
}

export class UnlockDrawerSuccessAction implements Action {
  readonly type = UNLOCK_DRAWER_SUCCESS;

  constructor(public payload: Teller) { }
}

export class UnlockDrawerFailAction implements Action {
  readonly type = UNLOCK_DRAWER_FAIL;

  constructor(public payload: Error) { }
}

export class LockDrawerAction implements Action {
  readonly type = LOCK_DRAWER;

  constructor(public payload: LockDrawerPayload) { }
}

export class LockDrawerSuccessAction implements Action {
  readonly type = LOCK_DRAWER_SUCCESS;

  constructor() { }
}

export class LoadCustomerAction implements Action {
  readonly type = LOAD_CUSTOMER;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectCustomerAction implements Action {
  readonly type = SELECT_CUSTOMER;

  constructor(public payload: SelectResourcePayload) { }
}

export class LoadAllDepositProductsAction implements Action {
  readonly type = LOAD_ALL_DEPOSIT_PRODUCTS;

  constructor(public payload: string) { }
}

export class LoadAllDepositProductsSuccessAction implements Action {
  readonly type = LOAD_ALL_DEPOSIT_PRODUCTS_SUCCESS;

  constructor(public payload: ProductInstance[]) { }
}

export class LoadAllLoanProductsAction implements Action {
  readonly type = LOAD_ALL_LOAN_PRODUCTS;

  constructor(public payload: string) { }
}

export class LoadAllLoanProductsSuccessAction implements Action {
  readonly type = LOAD_ALL_LOAN_PRODUCTS_SUCCESS;

  constructor(public payload: Case[]) { }
}

export class ConfirmTransactionAction implements Action {
  readonly type = CONFIRM_TRANSACTION;

  constructor(public payload: ConfirmTransactionPayload) {}
}

export class ConfirmTransactionSuccessAction implements Action {
  readonly type = CONFIRM_TRANSACTION_SUCCESS;

  constructor(public payload: ConfirmTransactionPayload) {}
}

export class ConfirmTransactionFailAction implements Action {
  readonly type = CONFIRM_TRANSACTION_FAIL;

  constructor(public payload: Error) {}
}

export type Actions
  = UnlockDrawerAction
  | UnlockDrawerSuccessAction
  | UnlockDrawerFailAction
  | LockDrawerAction
  | LockDrawerSuccessAction
  | LoadCustomerAction
  | SelectCustomerAction
  | LoadAllDepositProductsAction
  | LoadAllDepositProductsSuccessAction
  | LoadAllLoanProductsAction
  | LoadAllLoanProductsSuccessAction
  | ConfirmTransactionAction
  | ConfirmTransactionSuccessAction
  | ConfirmTransactionFailAction;
