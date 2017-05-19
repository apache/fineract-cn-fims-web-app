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
import * as fromCustomers from './customers.reducer';
import * as fromCustomerForm from './form.reducer';
import * as fromCustomerTasks from './tasks/tasks.reducer';
import * as fromCustomerTaskForm from './tasks/form.reducer';
import * as fromCustomerIdentificationCards from './identityCards/identity-cards.reducer';
import * as fromCustomerIdentificationCardForm from './identityCards/form.reducer';
import * as fromCatalogs from './catalogs/catalogs.reducer';
import * as fromCommands from './commands/commands.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceAll,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../../components/store/resource.reducer';

export interface State extends fromRoot.State{
  customers: ResourceState;
  customerForm: fromCustomerForm.State;
  customerTasks: ResourceState;
  customerTaskForm: fromCustomerTaskForm.State;
  customerCatalogs: fromCatalogs.State;
  customerCommands: fromCommands.State;
  customerIdentificationCards: ResourceState;
  customerIdentificationCardForm: fromCustomerIdentificationCardForm.State;
}

const reducers = {
  customers: createResourceReducer('Customer', fromCustomers.reducer),
  customerForm: fromCustomerForm.reducer,
  customerTasks: createResourceReducer('Customer Task', fromCustomerTasks.reducer),
  customerTaskForm: fromCustomerTaskForm.reducer,
  customerCatalogs: fromCatalogs.reducer,
  customerCommands: fromCommands.reducer,
  customerIdentificationCards: createResourceReducer('Customer Identity Card', fromCustomerIdentificationCards.reducer, 'number'),
  customerIdentificationCardForm: fromCustomerIdentificationCardForm.reducer
};

export class CustomersStore extends Store<State>{}

export function customerStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(customerModuleReducer);
  return appStore;
}

export const customerModuleReducer: ActionReducer<State> = createReducer(reducers);

export const getCustomersState = (state: State) => state.customers;

export const getCustomerFormState = (state: State) => state.customerForm;

export const getCustomerLoadedAt = createSelector(getCustomersState, getResourceLoadedAt);
export const getSelectedCustomer = createSelector(getCustomersState, getResourceSelected);

/**
 * Customer Task Selectors
 */
export const getCustomerTasksState = (state: State) => state.customerTasks;

export const getAllCustomerTaskEntities = createSelector(getCustomerTasksState, getResourceAll);

/**
 * Customer Catalog Selectors
 */

export const getCustomerCatalogsState = (state: State) => state.customerCatalogs;

export const getAllCustomerCatalogEntities = createSelector(getCustomerCatalogsState, fromCatalogs.getAll);

/**
 * Customer Command Selectors
 */

export const getCustomerCommandsState = (state: State) => state.customerCommands;

export const getAllCustomerCommands = createSelector(getCustomerCommandsState, fromCommands.getCommands);

/**
 * Customer Identification Card Selectors
 */
export const getCustomerIdentificationCardsState = (state: State) => state.customerIdentificationCards;

export const getAllCustomerIdentificationCardEntities = createSelector(getCustomerIdentificationCardsState, getResourceAll);

export const getCustomerIdentificationCardFormState = (state: State) => state.customerIdentificationCardForm;

export const getIdentificationCardLoadedAt = createSelector(getCustomerIdentificationCardsState, getResourceLoadedAt);
export const getSelectedIdentificationCard = createSelector(getCustomerIdentificationCardsState, getResourceSelected);
