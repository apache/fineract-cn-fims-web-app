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
import * as fromChartOfAccounts from './ledger/chart-of-account.reducer';
import * as fromJournalEntrySearch from './ledger/journal-entry/search.reducer';
import * as fromAccounts from './account/accounts.reducer';
import * as fromAccountEntrySearch from './account/entries/search.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer, getResourceEntities,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../../common/store/resource.reducer';
import {createFormReducer, FormState, getFormError} from '../../../common/store/form.reducer';
import {
  createSearchReducer, getSearchEntities, getSearchLoading, getSearchTotalElements, getSearchTotalPages,
  SearchState
} from '../../../common/store/search.reducer';

export interface State extends fromRoot.State{
  accounts: ResourceState;
  accountForm: FormState;
  accountEntrySearch: fromAccountEntrySearch.State;

  ledgers: fromLedgers.State;
  ledgerForm: FormState;
  trialBalance: fromTrialBalance.State;
  chartOfAccounts: fromChartOfAccounts.State;
  journalEntrySearch: fromJournalEntrySearch.State;
  journalEntryForm: FormState;

  transactionTypes: ResourceState;
  transactionTypeSearch: SearchState;
  transactionForm: FormState;
}

const reducers = {
  ledgers: fromLedgers.reducer,
  ledgerForm: createFormReducer('Ledger', fromLedgerForm.reducer),
  trialBalance: fromTrialBalance.reducer,
  chartOfAccounts: fromChartOfAccounts.reducer,

  journalEntrySearch: fromJournalEntrySearch.reducer,
  journalEntryForm: createFormReducer('Journal Entry'),

  transactionTypes: createResourceReducer('Transaction Type', undefined, 'code'),
  transactionTypeSearch: createSearchReducer('Transaction Type'),
  transactionForm: createFormReducer('Transaction Type'),

  accounts: createResourceReducer('Account', fromAccounts.reducer),
  accountForm: createFormReducer('Account'),
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
export const getLedgerFormError = createSelector(getLedgerFormState, getFormError);

export const getTrialBalanceState = (state: State) => state.trialBalance;

export const getChartOfAccountsState = (state: State) => state.chartOfAccounts;

export const getLedgerEntities = createSelector(getLedgerState, fromLedgers.getEntities);
export const getLedgersLoadedAt = createSelector(getLedgerState, fromLedgers.getLoadedAt);
export const getLedgerTopLevelIds = createSelector(getLedgerState, fromLedgers.getTopLevelIds);
export const getSelectedLedger = createSelector(getLedgerState, fromLedgers.getSelected);

export const getAllTopLevelLedgerEntities = createSelector(getLedgerTopLevelIds, getLedgerEntities, (topLevelIds, entities) => {
  return topLevelIds.map(id => entities[id]);
});

export const getTrialBalance = createSelector(getTrialBalanceState, fromTrialBalance.getTrialBalance);

export const getChartOfAccountEntries = createSelector(getChartOfAccountsState, fromChartOfAccounts.getChartOfAccountEntries);

export const getChartOfAccountLoading = createSelector(getChartOfAccountsState, fromChartOfAccounts.getLoading);

/**
 * Journal Entries Selectors
 */
export const getJournalEntrySearchState = (state: State) => state.journalEntrySearch;

export const getJournalEntryFormState = (state: State) => state.journalEntryForm;
export const getJournalEntryFormError = createSelector(getJournalEntryFormState, getFormError);

export const getJournalEntryEntities = createSelector(getJournalEntrySearchState, fromJournalEntrySearch.getEntities);

export const getSearchJournalEntryIds = createSelector(getJournalEntrySearchState, fromJournalEntrySearch.getIds);

export const getJournalEntriesSearchResult = createSelector(getJournalEntryEntities, getSearchJournalEntryIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

/**
 * Accounts
 */
export const getAccountsState = (state: State) => state.accounts;

export const getAccountFormState = (state: State) => state.accountForm;
export const getAccountFormError = createSelector(getAccountFormState, getFormError);

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

/**
 * Transaction Types
 */

export const getTransactionTypesState = (state: State) => state.transactionTypes;

export const getTransactionTypeLoadedAt = createSelector(getTransactionTypesState, getResourceLoadedAt);
export const getSelectedTransactionType = createSelector(getTransactionTypesState, getResourceSelected);

export const getTransactionTypeSearchState = (state: State) => state.transactionTypeSearch;

export const getTransactionTypeFormState = (state: State) => state.transactionForm;
export const getTransactionTypeFormError = createSelector(getTransactionTypeFormState, getFormError);


export const getSearchTransactionTypes = createSelector(getTransactionTypeSearchState, getSearchEntities);
export const getTransactionTypeSearchTotalElements = createSelector(getTransactionTypeSearchState, getSearchTotalElements);
export const getTransactionTypeSearchTotalPages = createSelector(getTransactionTypeSearchState, getSearchTotalPages);
export const getTransactionTypeSearchLoading = createSelector(getTransactionTypeSearchState, getSearchLoading);

export const getTransactionTypeSearchResults = createSelector(getSearchTransactionTypes, getTransactionTypeSearchTotalPages, getTransactionTypeSearchTotalElements, (transactionTypes, totalPages, totalElements) => {
  return {
    transactionTypes,
    totalPages,
    totalElements
  };
});
