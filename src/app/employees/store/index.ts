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
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../../common/store/resource.reducer';
import {createFormReducer, FormState, getFormError} from '../../../common/store/form.reducer';

export interface State extends fromRoot.State {
  employees: ResourceState;
  employeeForm: FormState;
}

const reducers = {
  employees: createResourceReducer('Employee'),
  employeeForm: createFormReducer('Employee')
};

export const employeeModuleReducer: ActionReducer<State> = createReducer(reducers);

export const getEmployeesState = (state: State) => state.employees;

export const getEmployeeFormState = (state: State) => state.employeeForm;
export const getEmployeeFormError = createSelector(getEmployeeFormState, getFormError);

export const getEmployeesLoadedAt = createSelector(getEmployeesState, getResourceLoadedAt);
export const getSelectedEmployee = createSelector(getEmployeesState, getResourceSelected);

export class EmployeesStore extends Store<State>{}

export function employeeStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(employeeModuleReducer);
  return appStore;
}
