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
import {Error} from '../../../../services/domain/error.model';
import {TaskDefinition} from '../../../../services/customer/domain/task-definition.model';
import {Command} from '../../../../services/customer/domain/command.model';
import {RoutePayload} from '../../../../common/store/route-payload';
import {
  CreateResourceSuccessPayload, LoadResourcePayload,
  SelectResourcePayload
} from '../../../../common/store/resource.reducer';

export const LOAD_ALL = type('[Customer Task] Load All');
export const LOAD_ALL_COMPLETE = type('[Customer Task] Load All Complete');

export const LOAD = type('[Customer Task] Load');
export const SELECT = type('[Customer Task] Select');

export const CREATE = type('[Customer Task] Create');
export const CREATE_SUCCESS = type('[Customer Task] Create Success');
export const CREATE_FAIL = type('[Customer Task] Create Fail');

export const ADD_TASK_TO_CUSTOMER = type('[Customer Task] Add To Customer');
export const ADD_TASK_TO_CUSTOMER_SUCCESS = type('[Customer Task] Add To Customer Success');
export const ADD_TASK_TO_CUSTOMER_FAIL = type('[Customer Task] Add To Customer Fail');

export const EXECUTE_TASK = type('[Customer Task] Execute');
export const EXECUTE_TASK_SUCCESS = type('[Customer Task] Success');
export const EXECUTE_TASK_FAIL = type('[Customer Task] Fail');

export const EXECUTE_COMMAND = type('[Customer Command] Execute');
export const EXECUTE_COMMAND_SUCCESS = type('[Customer Command] Success');
export const EXECUTE_COMMAND_FAIL = type('[Customer Command] Fail');

export const RESET_FORM = type('[Customer Task] Reset Form');

export interface CreateTaskPayload extends RoutePayload {
  task: TaskDefinition
}

export interface ExecuteTaskPayload extends RoutePayload {
  customerId: string;
  taskId: string;
}

export interface ExecuteCommandPayload{
  customerId: string;
  command: Command;
}

export interface AddTaskPayload extends RoutePayload{
  customerId: string;
  taskId: string;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: string) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: TaskDefinition[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateTaskAction implements Action {
  readonly type = CREATE;

  constructor(public payload: CreateTaskPayload) { }
}

export class CreateTaskSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateTaskFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class AddCustomerTaskAction implements Action{
  readonly type = ADD_TASK_TO_CUSTOMER;

  constructor(public payload: AddTaskPayload){}
}

export class AddCustomerTaskSuccessAction implements Action{
  readonly type = ADD_TASK_TO_CUSTOMER_SUCCESS;

  constructor(public payload: AddTaskPayload){}
}

export class AddCustomerTaskFailAction implements Action{
  readonly type = ADD_TASK_TO_CUSTOMER_FAIL;

  constructor(public payload: Error){}
}

export class ExecuteTaskAction implements Action {
  readonly type = EXECUTE_TASK;

  constructor(public payload: ExecuteTaskPayload) { }
}

export class ExecuteTaskSuccessAction implements Action {
  readonly type = EXECUTE_TASK_SUCCESS;

  constructor(public payload: ExecuteTaskPayload) { }
}

export class ExecuteTaskFailAction implements Action {
  readonly type = EXECUTE_TASK_FAIL;

  constructor(public payload: Error) { }
}

export class ExecuteCommandAction implements Action {
  readonly type = EXECUTE_COMMAND;

  constructor(public payload: ExecuteCommandPayload) { }
}

export class ExecuteCommandSuccessAction implements Action {
  readonly type = EXECUTE_COMMAND_SUCCESS;

  constructor(public payload: ExecuteCommandPayload) { }
}

export class ExecuteCommandFailAction implements Action {
  readonly type = EXECUTE_COMMAND_FAIL;

  constructor(public payload: Error) { }
}

export class ResetTaskFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | CreateTaskAction
  | CreateTaskSuccessAction
  | CreateTaskFailAction
  | ExecuteTaskAction
  | ExecuteTaskSuccessAction
  | ExecuteTaskFailAction
  | ExecuteCommandAction
  | ExecuteCommandSuccessAction
  | ExecuteCommandFailAction
  | ResetTaskFormAction
