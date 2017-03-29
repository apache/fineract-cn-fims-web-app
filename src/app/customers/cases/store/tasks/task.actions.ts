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

import {type} from '../../../../util';
import {Action} from '@ngrx/store';
import {TaskInstance} from '../../../../../services/portfolio/domain/task-instance.model';

export const LOAD_ALL = type('[Case Task] Load All');
export const LOAD_ALL_COMPLETE = type('[Case Task] Load All Complete');

export interface LoadAllTasksPayload{
  caseId: string;
  productId: string;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: LoadAllTasksPayload) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: TaskInstance[]) { }
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction;
