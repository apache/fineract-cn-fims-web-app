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
import {Error} from '../../../../services/domain/error.model';
import {FimsTaskInstance} from '../model/fims-task-instance.model';

export const LOAD_ALL = type('[Case Task] Load All');
export const LOAD_ALL_COMPLETE = type('[Case Task] Load All Complete');

export const EXECUTE_TASK = type('[Case Task] Execute');
export const EXECUTE_TASK_SUCCESS = type('[Case Task] Execute Success');
export const EXECUTE_TASK_FAIL = type('[Case Task] Execute Fail');

export interface LoadAllTasksPayload {
  caseId: string;
  productId: string;
}

export interface ExecuteTaskPayload {
  action: string;
  productIdentifier: string;
  caseIdentifier: string;
  taskIdentifier: string;
  executedBy: string;
  executed: boolean;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: LoadAllTasksPayload) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: FimsTaskInstance[]) { }
}

export class ExecuteTaskAction implements Action {
  readonly type = EXECUTE_TASK;

  constructor(public payload: ExecuteTaskPayload) {}
}

export class ExecuteTaskActionSuccess implements Action {
  readonly type = EXECUTE_TASK_SUCCESS;

  constructor(public payload: ExecuteTaskPayload) {}
}

export class ExecuteTaskActionFail implements Action {
  readonly type = EXECUTE_TASK_FAIL;

  constructor(public payload: Error) {}
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | ExecuteTaskAction
  | ExecuteTaskActionSuccess
  | ExecuteTaskActionFail;
