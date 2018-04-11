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
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../store/index';
import {createSelector} from 'reselect';
import {createResourceReducer, getResourceLoadedAt, getResourceSelected, ResourceState} from '../../common/store/resource.reducer';
import {createFormReducer, FormState, getFormError} from '../../common/store/form.reducer';

export interface State extends fromRoot.State {
  roles: ResourceState;
  roleForm: FormState;
}

const reducers = {
  roles: createResourceReducer('Role'),
  roleForm: createFormReducer('Role'),
};

export const roleModuleReducer: ActionReducer<State> = createReducer(reducers);

export class RolesStore extends Store<State> {}

export function roleStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(roleModuleReducer);
  return appStore;
}

export const getRolesState = (state: State) => state.roles;

export const getRoleFormState = (state: State) => state.roleForm;
export const getRoleFormError = createSelector(getRoleFormState, getFormError);

export const getRolesLoadedAt = createSelector(getRolesState, getResourceLoadedAt);
export const getSelectedRole = createSelector(getRolesState, getResourceSelected);
