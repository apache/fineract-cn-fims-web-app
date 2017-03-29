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
import * as fromEmployees from './employees.reducer';
import * as fromEmployeeForm from './form.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';

export interface State extends fromRoot.State{
  employees: fromEmployees.State;
  employeeForm: fromEmployeeForm.State;
}

const reducers = {
  employees: fromEmployees.reducer,
  employeeForm: fromEmployeeForm.reducer
};

export const employeeModuleReducer: ActionReducer<State> = createReducer(reducers);

export const getEmployeesState = (state: State) => state.employees;

export const getEmployeeFormState = (state: State) => state.employeeForm;

export const getEmployeeEntities = createSelector(getEmployeesState, fromEmployees.getEntities);
export const getEmployeeIds = createSelector(getEmployeesState, fromEmployees.getIds);
export const getSelectedEmployeeId = createSelector(getEmployeesState, fromEmployees.getSelectedId);
export const getSelectedEmployee = createSelector(getEmployeesState, fromEmployees.getSelected);

export class EmployeesStore extends Store<State>{}

export function employeeStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(employeeModuleReducer);
  return appStore;
}
