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
import {type} from '../../../store/util';
import {Action} from '@ngrx/store';
import {RoutePayload} from '../../../common/store/route-payload';
import {PayrollDistribution} from '../../../services/customer/domain/payroll-distribution.model';

export const LOAD = type('[Customer Payroll] Load');

export const UPDATE = type('[Customer Payroll] Update');
export const UPDATE_SUCCESS = type('[Customer Payroll] Update Success');
export const UPDATE_FAIL = type('[Customer Payroll] Update Fail');

export interface PayrollDistributionRoutePayload extends RoutePayload {
  customerId: string;
  distribution: PayrollDistribution
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: PayrollDistribution) { }
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
