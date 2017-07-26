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

import * as task from './task.actions';
import {TaskInstance} from '../../../../services/portfolio/domain/task-instance.model';
import {StatusCommand} from '../model/fims-command.model';
import {FimsTaskInstance} from '../model/fims-task-instance.model';

export interface State {
  commands: StatusCommand[];
}

export const initialState: State = {
  commands: [
    { action: 'OPEN', preStates: ['CREATED'], tasks: []},
    { action: 'APPROVE', preStates: ['PENDING'], tasks: []},
    { action: 'DENY', preStates: ['PENDING'], tasks: []},
    { action: 'CLOSE', preStates: ['APPROVED', 'ACTIVE'], tasks: []},
    { action: 'DISBURSE', preStates: ['APPROVED'], tasks: []}
  ]
};

export function reducer(state = initialState, action: task.Actions): State {

  switch (action.type) {

    case task.LOAD_ALL: {
      return initialState;
    }

    case task.LOAD_ALL_COMPLETE: {
      const entities = action.payload;

      const commands = state.commands.map(command => {
        return Object.assign({}, command, {
          tasks: entities.filter(instance => instance.taskDefinition.actions.indexOf(command.action) > -1)
        })
      });

      return {
        commands
      };
    }

    case task.EXECUTE_TASK_SUCCESS: {
      const payload = action.payload;

      const commands = state.commands.map(command => {
        if(command.action !== payload.action) return command;

        return Object.assign({}, command, {
          tasks: command.tasks.map(task => {
            if(task.taskDefinition.identifier !== payload.taskIdentifier) return task;

            return Object.assign({}, task, {
              executedOn: payload.executed ? new Date().toISOString() : undefined,
              executedBy: payload.executedBy
            })
          })
        })
      });

      return {
        commands
      }
    }

    default: {
      return state;
    }
  }
}

export const getCommands = (state: State) => state.commands;
