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

import * as fromRoot from '../../reducers';
import * as fromLedgers from './ledger/ledgers.reducer';
import * as fromLedgerForm from './ledger/form.reducer';
import * as fromTrialBalance from './ledger/trial-balance.reducer';
import * as fromJournalEntrySearch from './ledger/journal-entry/search.reducer';
import * as fromJournalEntryForm from './ledger/journal-entry/form.reducer';
import * as fromAccounts from './account/accounts.reducer';
import * as fromAccountForm from './account/form.reducer';
import * as fromAccountEntrySearch from './account/entries/search.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../../components/store/resource.reducer';

export interface State extends fromRoot.State{
  accounts: ResourceState;
  accountForm: fromAccountForm.State;
  accountEntrySearch: fromAccountEntrySearch.State;

  ledgers: fromLedgers.State;
  ledgerForm: fromLedgerForm.State;
  trialBalance: fromTrialBalance.State;
  journalEntrySearch: fromJournalEntrySearch.State;
  journalEntryForm: fromJournalEntryForm.State;
}

const reducers = {
  ledgers: fromLedgers.reducer,
  ledgerForm: fromLedgerForm.reducer,
  trialBalance: fromTrialBalance.reducer,

  journalEntrySearch: fromJournalEntrySearch.reducer,
  journalEntryForm: fromJournalEntryForm.reducer,

  accounts: createResourceReducer('Account', fromAccounts.reducer),
  accountForm: fromAccountForm.reducer,
  accountEntrySearch: fromAccountEntrySearch.reducer,
};

export const accountingModuleReducer: ActionReducer<State> = createReducer(reducers);

export class AccountingStore extends Store<State>{}

export function accountingStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(accountingModuleReducer);
  return appStore;
}

/**
 * Ledger Selectors
 */
export const getLedgerState = (state: State) => state.ledgers;

export const getLedgerFormState = (state: State) => state.ledgerForm;

export const getTrialBalanceState = (state: State) => state.trialBalance;

export const getLedgerEntities = createSelector(getLedgerState, fromLedgers.getEntities);
export const getLedgersLoadedAt = createSelector(getLedgerState, fromLedgers.getLoadedAt);
export const getLedgerTopLevelIds = createSelector(getLedgerState, fromLedgers.getTopLevelIds);
export const getSelectedLedger = createSelector(getLedgerState, fromLedgers.getSelected);

export const getAllTopLevelLedgerEntities = createSelector(getLedgerTopLevelIds, getLedgerEntities, (topLevelIds, entities) => {
  return topLevelIds.map(id => entities[id]);
});

export const getTrialBalance = createSelector(getTrialBalanceState, fromTrialBalance.getTrialBalance);

/**
 * Journal Entries Selectors
 */
export const getJournalEntrySearchState = (state: State) => state.journalEntrySearch;

export const getJournalEntryFormState = (state: State) => state.journalEntryForm;

export const getJournalEntryEntities = createSelector(getJournalEntrySearchState, fromJournalEntrySearch.getEntities);

export const getSearchJournalEntryIds = createSelector(getJournalEntrySearchState, fromJournalEntrySearch.getIds);

export const getJournalEntriesSearchResult = createSelector(getJournalEntryEntities, getSearchJournalEntryIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

/**
 * Accounts
 */
export const getAccountsState = (state: State) => state.accounts;

export const getAccountsLoadedAt = createSelector(getAccountsState, getResourceLoadedAt);
export const getSelectedAccount = createSelector(getAccountsState, getResourceSelected);


export const getAccountEntrySearchState = (state: State) => state.accountEntrySearch;
export const getAccountEntrySearchEntities = createSelector(getAccountEntrySearchState, fromAccountEntrySearch.getEntries);
export const getAccountEntrySearchTotalElements = createSelector(getAccountEntrySearchState, fromAccountEntrySearch.getTotalElements);
export const getAccountEntrySearchTotalPages = createSelector(getAccountEntrySearchState, fromAccountEntrySearch.getTotalPages);

export const getAccountEntrySearchResults = createSelector(getAccountEntrySearchEntities, getAccountEntrySearchTotalElements, getAccountEntrySearchTotalPages, (entities, totalElements, totalPages) => {
  return {
    entries: entities,
    totalPages: totalPages,
    totalElements: totalElements
  }
});
