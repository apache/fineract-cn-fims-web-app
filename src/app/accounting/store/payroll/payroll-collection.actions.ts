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
import {PayrollCollectionSheet} from '../../../services/payroll/domain/payroll-collection-sheet.model';
import {PayrollCollectionHistory} from '../../../services/payroll/domain/payroll-collection-history.model';
import {CreateResourceSuccessPayload} from '../../../common/store/resource.reducer';

export const LOAD_ALL_COLLECTIONS = type('[Payroll Collection] Load All');
export const LOAD_ALL_COLLECTIONS_COMPLETE = type('[Payroll Collection] Load All Complete');

export const LOAD = type('[Payroll Collection] Load');
export const SELECT = type('[Payroll Collection] Select');

export const CREATE = type('[Payroll Collection] Create');
export const CREATE_SUCCESS = type('[Payroll Collection] Create Success');
export const CREATE_FAIL = type('[Payroll Collection] Create Fail');

export const RESET_FORM = type('[Payroll Collection] Reset Form');

export interface CreateSheetPayload extends RoutePayload {
  sheet: PayrollCollectionSheet;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL_COLLECTIONS;

  constructor() { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COLLECTIONS_COMPLETE;

  constructor(public payload: PayrollCollectionHistory[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: PayrollCollectionHistory) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: string) { }
}

export class CreateAction implements Action {
  readonly type = CREATE;

  constructor(public payload: CreateSheetPayload) { }
}

export class CreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() { }
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | CreateAction
  | CreateSuccessAction
  | CreateFailAction
  | ResetFormAction;
