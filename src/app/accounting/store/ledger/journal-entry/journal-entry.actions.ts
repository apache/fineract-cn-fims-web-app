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
import {Error} from '../../../../../services/domain/error.model';
import {type} from '../../../../util';
import {JournalEntry} from '../../../../../services/accounting/domain/journal-entry.model';
import {RoutePayload} from '../../../../../common/store/route-payload';

export const SEARCH = type('[Journal Entry] Search');
export const SEARCH_COMPLETE = type('[Journal Entry] Search Complete');

export const CREATE = type('[Journal Entry] Create');
export const CREATE_SUCCESS = type('[Journal Entry] Create Success');
export const CREATE_FAIL = type('[Journal Entry] Create Fail');

export const RESET_FORM = type('[Journal Entry] Reset Form');

export interface SearchPayload{
  startDate: string;
  endDate: string;
}

export interface JournalEntryRoutePayload extends RoutePayload{
  journalEntry: JournalEntry
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: SearchPayload) { }
}

export class SearchCompleteAction implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: JournalEntry[]) { }
}

export class CreateJournalEntryAction implements Action {
  readonly type = CREATE;

  constructor(public payload: JournalEntryRoutePayload) { }
}

export class CreateJournalEntrySuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: JournalEntryRoutePayload) { }
}

export class CreateJournalEntryFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetJournalEntryFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() {}
}

export type Actions = SearchAction
  | SearchCompleteAction
  | CreateJournalEntryAction
  | CreateJournalEntrySuccessAction
  | CreateJournalEntryFailAction
  | ResetJournalEntryFormAction
