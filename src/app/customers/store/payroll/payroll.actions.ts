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
import {Action} from '@ngrx/store';
import {RoutePayload} from '../../../common/store/route-payload';
import {PayrollConfiguration} from '../../../services/payroll/domain/payroll-configuration.model';

export const LOAD = type('[Customer Payroll] Load');

export const UPDATE = type('[Customer Payroll] Update');
export const UPDATE_SUCCESS = type('[Customer Payroll] Update Success');
export const UPDATE_FAIL = type('[Customer Payroll] Update Fail');

export interface PayrollDistributionRoutePayload extends RoutePayload {
  customerId: string;
  distribution: PayrollConfiguration;
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: PayrollConfiguration) { }
}

export class UpdatePayrollDistributionAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: PayrollDistributionRoutePayload) { }
}

export class UpdatePayrollDistributionSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: PayrollDistributionRoutePayload) { }
}

export class UpdatePayrollDistributionFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export type Actions
  = LoadAction
  | UpdatePayrollDistributionAction
  | UpdatePayrollDistributionSuccessAction
  | UpdatePayrollDistributionFailAction;
