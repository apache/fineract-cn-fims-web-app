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
import * as fromCommands from './commands/commands.reducer';
import * as fromGroupDefinition from './definition/definition.reducer'
import * as fromMeeting from './meeting/meeting.reducer'


import { ActionReducer, Store } from '@ngrx/store';
import { createReducer } from '../../store/index';
import { createSelector } from 'reselect';
import {
  createResourceReducer,
  getResourceAll,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../common/store/resource.reducer';
import { createFormReducer, FormState, getFormError } from '../../common/store/form.reducer';

export interface State extends fromRoot.State {
  groups: ResourceState;
  groupForm: FormState;
  tasks: ResourceState;
  taskForm: FormState;
  groupCommands: fromCommands.State;
  groupDefinitions: ResourceState;
  groupDefinitionForm: FormState;
  meetings: ResourceState;
  meetingForm: FormState;

}

const reducers = {
  groups: createResourceReducer('Group', fromGroups.reducer),
  groupForm: createFormReducer('Group'),
  taskForm: createFormReducer('Task'),
  groupCommands: fromCommands.reducer,
  groupDefinitions: createResourceReducer('GroupDefinition', fromGroupDefinition.reducer),
  groupDefinitionForm: createFormReducer('GroupDefinition'),
  meetings: createResourceReducer('Meeting', fromMeeting.reducer),
  MeetingForm: createFormReducer('Meeting'),

};

export class GroupsStore extends Store<State> { }

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
 * Defintion Selectors
 */
export const getGroupDefinitionsState = (state: State) => state.groupDefinitions;

export const getAllGroupDefinitionEntities = createSelector(getGroupDefinitionsState, getResourceAll);

export const getGroupDefinitionLoadedAt = createSelector(getGroupDefinitionsState, getResourceLoadedAt);
export const getSelectedGroupDefinition = createSelector(getGroupDefinitionsState, getResourceSelected);


/**
 * Meeting Selectors
 */
export const getMeetingsState = (state: State) => state.meetings;
export const getAllMeetingEntities = createSelector(getMeetingsState, getResourceAll);

export const getMeetingLoadedAt = createSelector(getMeetingsState, getResourceLoadedAt);
export const getSelectedMeeting = createSelector(getMeetingsState, getResourceSelected);



/**
 * group Command Selectors
 */

export const getGroupCommandsState = (state: State) => state.groupCommands;

export const getAllGroupCommands = createSelector(getGroupCommandsState, fromCommands.getCommands);

