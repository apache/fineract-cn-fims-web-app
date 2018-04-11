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
import {type} from '../../../store/util';
import {RoutePayload} from '../../../common/store/route-payload';
import {Action} from '@ngrx/store';
import {DividendDistribution} from '../../../services/depositAccount/domain/definition/dividend-distribution.model';

export const LOAD_ALL = type('[Deposit Product Definition Dividend] Load All');
export const LOAD_ALL_COMPLETE = type('[Deposit Product Definition Dividend] Load All Complete');

export const CREATE = type('[Deposit Product Definition Dividend] Create');
export const CREATE_SUCCESS = type('[Deposit Product Definition Dividend] Create Success');
export const CREATE_FAIL = type('[Deposit Product Definition Dividend] Create Fail');

export interface DividendPayload extends RoutePayload {
  productDefinitionId: string;
  dividendDistribution: DividendDistribution;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: string) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: DividendDistribution[]) { }
}

export class CreateDividendDistributionAction implements Action {
  readonly type = CREATE;

  constructor(public payload: DividendPayload) { }
}

export class CreateDividendDistributionSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: DividendPayload) { }
}

export class CreateDividendDistributionFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | CreateDividendDistributionAction
  | CreateDividendDistributionSuccessAction
  | CreateDividendDistributionFailAction;
