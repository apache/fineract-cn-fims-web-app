/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as fromRoot from '../../store';
import * as fromCustomers from './customers.reducer';
import * as fromCustomerTasks from './customerTasks/customer-tasks.reducer';
import * as fromCustomerIdentificationCards from './identityCards/identity-cards.reducer';
import * as fromCatalogs from './catalogs/catalog.reducer';
import * as fromCommands from './commands/commands.reducer';
import * as fromScans from './identityCards/scans/scans.reducer';
import * as fromTasks from './tasks/tasks.reducer';
import * as fromPayrollDistribution from './payroll/payroll.reducer';

import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../store/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceAll,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../common/store/resource.reducer';
import {createFormReducer, FormState, getFormError} from '../../common/store/form.reducer';

export interface State extends fromRoot.State {
  customers: ResourceState;
  customerForm: FormState;
  tasks: ResourceState;
  taskForm: FormState;
  customerTasks: fromCustomerTasks.State;
  customerCatalog: fromCatalogs.State;
  customerCommands: fromCommands.State;
  customerIdentificationCards: ResourceState;
  customerIdentificationCardForm: FormState;
  customerIdentificationCardScans: ResourceState;
  customerIdentificationCardScanForm: FormState;
  customerPayrollDistribution: fromPayrollDistribution.State;
}

const reducers = {
  customers: createResourceReducer('Customer', fromCustomers.reducer),
  customerForm: createFormReducer('Customer'),
  tasks: createResourceReducer('Task', fromTasks.reducer),
  taskForm: createFormReducer('Task'),
  customerTasks: fromCustomerTasks.reducer,
  customerCatalog: fromCatalogs.reducer,
  customerCommands: fromCommands.reducer,
  customerIdentificationCards: createResourceReducer('Customer Identity Card', fromCustomerIdentificationCards.reducer, 'number'),
  customerIdentificationCardForm: createFormReducer('Customer Identity Card'),
  customerIdentificationCardScans: createResourceReducer('Customer Identity Card Scan', fromScans.reducer),
  customerIdentificationCardScanForm: createFormReducer('Customer Identity Card Scan'),
  customerPayrollDistribution: fromPayrollDistribution.reducer
};

export class CustomersStore extends Store<State> {}

export const customerModuleReducer: ActionReducer<State> = createReducer(reducers);

export function customerStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(customerModuleReducer);
  return appStore;
}

export const getCustomersState = (state: State) => state.customers;

export const getCustomerFormState = (state: State) => state.customerForm;
export const getCustomerFormError = createSelector(getCustomerFormState, getFormError);

export const getCustomerLoadedAt = createSelector(getCustomersState, getResourceLoadedAt);
export const getSelectedCustomer = createSelector(getCustomersState, getResourceSelected);

/**
 * Task Selectors
 */
export const getTasksState = (state: State) => state.tasks;

export const getAllTaskEntities = createSelector(getTasksState, getResourceAll);

export const getTaskLoadedAt = createSelector(getTasksState, getResourceLoadedAt);
export const getSelectedTask = createSelector(getTasksState, getResourceSelected);

/**
 * Customer Task Selectors
 */
export const getCustomerTaskCommandsState = (state: State) => state.customerTasks;

export const getCustomerTaskProcessSteps = createSelector(getCustomerTaskCommandsState, fromCustomerTasks.getProcessSteps);


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
export const getCustomerIdentificationCardFormError = createSelector(getCustomerIdentificationCardFormState, getFormError);

export const getIdentificationCardLoadedAt = createSelector(getCustomerIdentificationCardsState, getResourceLoadedAt);
export const getSelectedIdentificationCard = createSelector(getCustomerIdentificationCardsState, getResourceSelected);

/**
 * Customer Identification Card Scan Selectors
 */
export const getIdentificationCardScansState = (state: State) => state.customerIdentificationCardScans;

export const getAllIdentificationCardScanEntities = createSelector(getIdentificationCardScansState, getResourceAll);

export const getCustomerIdentificationCardScanFormState = (state: State) => state.customerIdentificationCardScanForm;
export const getCustomerIdentificationCardScanFormError = createSelector(getCustomerIdentificationCardScanFormState, getFormError);

/**
 * Customer Payroll Distribution Selectors
 */
export const getPayrollDistributionState = (state: State) => state.customerPayrollDistribution;

export const getPayrollDistribution = createSelector(getPayrollDistributionState, fromPayrollDistribution.getPayrollDistribution);
export const getPayrollDistributionLoadedAt = createSelector(getPayrollDistributionState,
  fromPayrollDistribution.getPayrollDistributionLoadedAt);

/**
 * Customer Catalog Selectors
 */
export const getCustomerCatalogState = (state: State) => state.customerCatalog;

export const getCustomerCatalog = createSelector(getCustomerCatalogState, fromCatalogs.getCustomerCatalog);
export const getCustomerCatalogLoadedAt = createSelector(getCustomerCatalogState, fromCatalogs.getCustomerCatalogLoadedAt);
export const getSelectedField = createSelector(getCustomerCatalogState, fromCatalogs.getSelectedField);
