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
import * as group from './group.actions';
import * as groupTasks from './groupTasks/group-task.actions';
import {GroupCommand} from '../../services/group/domain/group-command.model';
import {GroupState} from '../../services/group/domain/group-state.model';
import {ResourceState} from '../../common/store/resource.reducer';

export const initialState: ResourceState = {
  ids: [],
  entities: {},
  loadedAt: {},
  selectedId: null,
};

export function reducer(state = initialState, action: group.Actions | groupTasks.Actions): ResourceState {

  switch (action.type) {

    case groupTasks.EXECUTE_COMMAND_SUCCESS: {
      const payload = action.payload;

      const groupId = payload.groupId;
      const command: GroupCommand = payload.command;

      const group = state.entities[groupId];

      let groupState: GroupState = null;

      if (command.action === 'ACTIVATE') {
        groupState = 'ACTIVE';
      }else if (command.action === 'CLOSE') {
        groupState = 'CLOSED';
      }else if (command.action === 'REOPEN') {
        groupState = 'ACTIVE';
      }

      group.currentState = groupState;

      return {
        ids: [ ...state.ids ],
        entities: Object.assign({}, state.entities, {
          [group.identifier]: group
        }),
        loadedAt: state.loadedAt,
        selectedId: state.selectedId
      };
    }

    default: {
      return state;
    }
  }
}
