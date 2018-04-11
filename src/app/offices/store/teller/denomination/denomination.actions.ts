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
import {type} from '../../../../store/util';
import {TellerDenomination} from '../../../../services/teller/domain/teller-denomination.model';
import {RoutePayload} from '../../../../common/store/route-payload';
import {Action} from '@ngrx/store';

export const LOAD_DENOMINATION = type('[Teller Denomination] Load All ');
export const LOAD_DENOMINATION_SUCCESS = type('[Teller Denomination] Load All Success');

export const CREATE_DENOMINATION = type('[Teller Denomination] Create');
export const CREATE_DENOMINATION_SUCCESS = type('[Teller Denomination] Create Success');
export const CREATE_DENOMINATION_FAIL = type('[Teller Denomination] Create Fail');

export interface LoadDenominationPayload {
  officeId: string;
  tellerCode: string;
}

export interface DenominationPayload extends RoutePayload {
  officeId: string;
  tellerCode: string;
  denomination: TellerDenomination;
}

export class LoadDenominationAction implements Action {
  readonly type = LOAD_DENOMINATION;

  constructor(public payload: LoadDenominationPayload) {}
}

export class LoadDenominationSuccessAction implements Action {
  readonly type = LOAD_DENOMINATION_SUCCESS;

  constructor(public payload: TellerDenomination[]) {}
}

export class CreateDenominationAction implements Action {
  readonly type = CREATE_DENOMINATION;

  constructor(public payload: DenominationPayload) {}
}

export class CreateDenominationSuccessAction implements Action {
  readonly type = CREATE_DENOMINATION_SUCCESS;

  constructor(public payload: DenominationPayload) {}
}

export class CreateDenominationFailAction implements Action {
  readonly type = CREATE_DENOMINATION_FAIL;

  constructor(public payload: Error) {}
}

export type Actions
  = LoadDenominationAction
  | LoadDenominationSuccessAction
  | CreateDenominationAction
  | CreateDenominationSuccessAction
  | CreateDenominationFailAction;
