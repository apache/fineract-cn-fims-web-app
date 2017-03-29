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
import {type} from '../../../../util';
import {FetchRequest} from '../../../../../services/domain/paging/fetch-request.model';
import {AccountEntryPage} from '../../../../../services/accounting/domain/account-entry-page.model';

export const SEARCH = type('[Account Entry] Search');
export const SEARCH_COMPLETE = type('[Account Entry] Search Complete');

export interface SearchActionPayload{
  accountId: string;
  startDate: string;
  endDate: string;
  fetchRequest: FetchRequest;
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: SearchActionPayload) { }
}

export class SearchCompleteAction implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: AccountEntryPage) { }
}

export type Actions = SearchAction
  | SearchCompleteAction;
