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
import {PlannedPaymentPage} from '../../../../../services/portfolio/domain/individuallending/planned-payment-page.model';
import {Action} from '@ngrx/store';

export const SEARCH = type('[Case Payments] Search');
export const SEARCH_COMPLETE = type('[Case Payments] Search Complete');

export interface SearchPaymentsPayload{
  productIdentifier: string;
  caseIdentifier: string;
  initialDisbursalDate?: string;
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: SearchPaymentsPayload) { }
}

export class SearchCompleteAction implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: PlannedPaymentPage) { }
}

export type Actions
  = SearchAction
  | SearchCompleteAction;

