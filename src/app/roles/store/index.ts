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
import * as fromRoles from './roles.reducer';
import * as fromRoleForm from './form.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';

export interface State extends fromRoot.State{
  roles: fromRoles.State;
  roleForm: fromRoleForm.State;
}

const reducers = {
  roles: fromRoles.reducer,
  rolesForm: fromRoleForm.reducer,
};

export const roleModuleReducer: ActionReducer<State> = createReducer(reducers);

export class RolesStore extends Store<State>{}

export function roleStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(roleModuleReducer);
  return appStore;
}

export const getRolesState = (state: State) => state.roles;

export const getRoleFormState = (state: State) => state.roleForm;

export const getRoleEntities = createSelector(getRolesState, fromRoles.getEntities);
export const getRoleIds = createSelector(getRolesState, fromRoles.getIds);
export const getSelectedRoleId = createSelector(getRolesState, fromRoles.getSelectedId);
export const getSelectedRole = createSelector(getRolesState, fromRoles.getSelected);
