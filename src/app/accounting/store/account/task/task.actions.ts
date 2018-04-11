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
import {Action} from '@ngrx/store';
import {type} from '../../../../store/util';
import {AccountCommand} from '../../../../services/accounting/domain/account-command.model';
import {RoutePayload} from '../../../../common/store/route-payload';

export const EXECUTE_COMMAND = type('[Account Command] Execute');
export const EXECUTE_COMMAND_SUCCESS = type('[Account Command] Success');
export const EXECUTE_COMMAND_FAIL = type('[Account Command] Fail');

export interface ExecuteCommandPayload extends RoutePayload {
  accountId: string;
  command: AccountCommand;
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

export type Actions = ExecuteCommandAction
  | ExecuteCommandSuccessAction
  | ExecuteCommandFailAction;
