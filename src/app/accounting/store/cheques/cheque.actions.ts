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
import {createResourceActions} from '../../../common/store/action-creator/action-creator';
import {type} from '../../../store/util';
import {Action} from '@ngrx/store';
import {ChequeProcessingCommand} from '../../../services/cheque/domain/cheque-processing-command';
import {Error} from '../../../services/domain/error.model';
import {FimsCheque} from '../../../services/cheque/domain/fims-cheque.model';

export const ChequeCRUDActions = createResourceActions<FimsCheque>('Cheque');

export const PROCESS = type('[Cheque] Process');
export const PROCESS_SUCCESS = type('[Cheque] Process Success');
export const PROCESS_FAIL = type('[Cheque] Process Fail');

export interface ProcessPayload {
  chequeIdentifier: string;
  command: ChequeProcessingCommand;
}

export class ProcessAction implements Action {
  readonly type = PROCESS;

  constructor(public payload: ProcessPayload) { }
}

export class ProcessSuccessAction implements Action {
  readonly type = PROCESS_SUCCESS;

  constructor(public payload: ProcessPayload) { }
}

export class ProcessFailAction implements Action {
  readonly type = PROCESS_FAIL;

  constructor(public payload: Error) { }
}

export type Actions
  = ProcessAction
  | ProcessSuccessAction
  | ProcessFailAction;

