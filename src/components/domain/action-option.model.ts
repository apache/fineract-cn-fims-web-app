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

import {WorkflowAction} from '../../services/portfolio/domain/individuallending/workflow-action.model';

export interface ActionOption{
  type: WorkflowAction,
  label: string,
}

export const ActionOptions: ActionOption[] = [
  { type: 'OPEN', label: 'loan is opened' },
  { type: 'DENY', label: 'loan is denied' },
  { type: 'APPROVE', label: 'loan is approved' },
  { type: 'ACCEPT_PAYMENT', label: 'payment is accepted' },
  { type: 'DISBURSE', label: 'loan is disbursed' },
  { type: 'MARK_LATE', label: 'payment is late' },
  { type: 'APPLY_INTEREST', label: 'interest is applied' },
  { type: 'WRITE_OFF', label: 'loan is written off' },
  { type: 'CLOSE', label: 'loan is closed' },
  { type: 'RECOVER', label: 'loan is recovered' }
];
