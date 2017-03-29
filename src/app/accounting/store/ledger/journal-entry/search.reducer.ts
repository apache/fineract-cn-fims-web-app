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

import * as journalEntry from './journal-entry.actions';
import {JournalEntry} from '../../../../../services/accounting/domain/journal-entry.model';


export interface State {
  ids: string[];
  entities: { [id: string]: JournalEntry };
  loading: boolean;
  startDate: string;
  endDate: string;
}

const initialState: State = {
  ids: [],
  entities: {},
  loading: false,
  startDate: null,
  endDate: null
};

export function reducer(state = initialState, action: journalEntry.Actions): State {

  switch (action.type) {

    case journalEntry.SEARCH: {
      const payload = action.payload;

      return Object.assign({}, state, {
        startDate: payload.startDate,
        endDate: payload.endDate,
        loading: true
      });
    }

    case journalEntry.SEARCH_COMPLETE: {
      const journalEntries = action.payload;

      const journalEntryIds = journalEntries.map(journalEntry => journalEntry.transactionIdentifier);

      const newJournalEntryEntities = journalEntries.reduce((entities: { [id: string]: JournalEntry }, journalEntry: JournalEntry) => {
        return Object.assign(entities, {
          [journalEntry.transactionIdentifier]: journalEntry
        });
      }, {});

      return {
        ids: [ ...journalEntryIds ],
        entities: newJournalEntryEntities,
        startDate: state.startDate,
        endDate: state.endDate,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}


export const getIds = (state: State) => state.ids;

export const getEntities = (state: State) => state.entities;

export const getStartDate = (state: State) => state.startDate;

export const getEndDate = (state: State) => state.endDate;

export const getLoading = (state: State) => state.loading;
