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
import * as fromGroups from './groups.reducer';
import * as fromGroupTasks from './groupTasks/group-tasks.reducer';
import * as fromCommands from './commands/commands.reducer';


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
  groups: ResourceState;
  groupForm: FormState;
  tasks: ResourceState;
  taskForm: FormState;
  groupTasks: fromGroupTasks.State;
  groupCommands: fromCommands.State;
}

const reducers = {
  groups: createResourceReducer('Group', fromGroups.reducer),
  groupForm: createFormReducer('Group'),
  taskForm: createFormReducer('Task'),
  groupTasks: fromGroupTasks.reducer,
  groupCommands: fromCommands.reducer,
  
};

export class GroupsStore extends Store<State> {}

export const groupModuleReducer: ActionReducer<State> = createReducer(reducers);

export function groupStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(groupModuleReducer);
  return appStore;
}

export const getGroupsState = (state: State) => state.groups;

export const getGroupFormState = (state: State) => state.groupForm;
export const getGroupFormError = createSelector(getGroupFormState, getFormError);

export const getGroupLoadedAt = createSelector(getGroupsState, getResourceLoadedAt);
export const getSelectedGroup = createSelector(getGroupsState, getResourceSelected);

/**
 * Task Selectors
 */
export const getTasksState = (state: State) => state.tasks;

export const getAllTaskEntities = createSelector(getTasksState, getResourceAll);

export const getTaskLoadedAt = createSelector(getTasksState, getResourceLoadedAt);
export const getSelectedTask = createSelector(getTasksState, getResourceSelected);

/**
 * groupTask Selectors
 */
export const getGroupTaskCommandsState = (state: State) => state.groupTasks;

export const getGroupTaskProcessSteps = createSelector(getGroupTaskCommandsState, fromGroupTasks.getProcessSteps);


/**
 * group Command Selectors
 */

export const getGroupCommandsState = (state: State) => state.groupCommands;

export const getAllGroupCommands = createSelector(getGroupCommandsState, fromCommands.getCommands);

