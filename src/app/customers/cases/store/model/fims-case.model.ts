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

import {CaseState} from '../../../../../services/portfolio/domain/case-state.model';
import {AccountAssignment} from '../../../../../services/portfolio/domain/account-assignment.model';
import {CaseParameters} from '../../../../../services/portfolio/domain/individuallending/case-parameters.model';

/**
 * Model interface with concrete CaseParameters instead of JSON string.
 */

export interface FimsCase {
  identifier: string;
  productIdentifier: string;
  parameters: CaseParameters;
  accountAssignments: AccountAssignment[];
  currentState: CaseState;
  createdOn?: string;
  createdBy?: string;
  lastModifiedOn?: string;
  lastModifiedBy?: string;
}


