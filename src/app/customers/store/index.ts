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
import * as fromCatalogs from './catalogs/catalogs.reducer';
import * as fromCommands from './commands/commands.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';

export interface State extends fromRoot.State{
  customers: fromCustomers.State;
  customerForm: fromCustomerForm.State;
  customerTasks: fromCustomerTasks.State;
  customerTaskForm: fromCustomerTaskForm.State;
  customerCatalogs: fromCatalogs.State;
  customerCommands: fromCommands.State;
}

const reducers = {
  customers: fromCustomers.reducer,
  customerForm: fromCustomerForm.reducer,
  customerTasks: fromCustomerTasks.reducer,
  customerTaskForm: fromCustomerTaskForm.reducer,
  customerCatalogs: fromCatalogs.reducer,
  customerCommands: fromCommands.reducer
};

export class CustomersStore extends Store<State>{}

export function customerStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(customerModuleReducer);
  return appStore;
}

export const customerModuleReducer: ActionReducer<State> = createReducer(reducers);

export const getCustomersState = (state: State) => state.customers;

export const getCustomerFormState = (state: State) => state.customerForm;

export const getCustomerEntities = createSelector(getCustomersState, fromCustomers.getEntities);
export const getCustomerIds = createSelector(getCustomersState, fromCustomers.getIds);
export const getSelectedCustomerId = createSelector(getCustomersState, fromCustomers.getSelectedId);
export const getSelectedCustomer = createSelector(getCustomersState, fromCustomers.getSelected);

/**
 * Customer Task Selectors
 */
export const getCustomerTasksState = (state: State) => state.customerTasks;

export const getCustomerTaskFormState = (state: State) => state.customerTaskForm;

export const getCustomerTaskEntities = createSelector(getCustomerTasksState, fromCustomerTasks.getEntities);
export const getCustomerTaskIds = createSelector(getCustomerTasksState, fromCustomerTasks.getIds);
export const getSelectedCustomerTaskId = createSelector(getCustomerTasksState, fromCustomerTasks.getSelectedId);
export const getSelectedCustomerTask = createSelector(getCustomerTasksState, fromCustomerTasks.getSelected);

export const getAllCustomerTaskEntities = createSelector(getCustomerTasksState, fromCustomerTasks.getAll);

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
