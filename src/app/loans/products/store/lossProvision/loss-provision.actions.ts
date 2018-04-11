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
import {Action} from '@ngrx/store';
import {RoutePayload} from '../../../../common/store/route-payload';
import {LossProvisionConfiguration} from '../../../../services/portfolio/domain/loss-provision-configuration.model';

export const LOAD = type('[Product Loss Provision] Load');

export const UPDATE = type('[Product Loss Provision] Update');
export const UPDATE_SUCCESS = type('[Product Loss Provision] Update Success');
export const UPDATE_FAIL = type('[Product Loss Provision] Update Fail');

export interface LossProvisionPayload extends RoutePayload {
  productIdentifier: string;
  configuration: LossProvisionConfiguration;
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LossProvisionConfiguration) { }
}

export class UpdateLossProvisionAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: LossProvisionPayload) { }
}

export class UpdateLossProvisionSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: LossProvisionPayload) { }
}

export class UpdateLossProvisionFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export type Actions
  = LoadAction
  | UpdateLossProvisionAction
  | UpdateLossProvisionSuccessAction
  | UpdateLossProvisionFailAction;
