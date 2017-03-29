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
import { createSelector } from 'reselect';
import {TaskDefinition} from '../../../../services/customer/domain/task-definition.model';

export interface State {
  ids: string[];
  entities: { [id: string]: TaskDefinition };
  selectedTaskId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedTaskId: null,
};

export function reducer(state = initialState, action: task.Actions): State {

  switch (action.type) {

    case task.LOAD_ALL_COMPLETE: {
      const taskDefinitions = action.payload;
      const newTasks = taskDefinitions.filter(taskDefinition => !state.entities[taskDefinition.identifier]);

      const newTaskIds = newTasks.map(task => task.identifier);

      const newTaskEntities = newTasks.reduce((entities: { [id: string]: TaskDefinition }, taskDefintion: TaskDefinition) => {
        return Object.assign(entities, {
          [taskDefintion.identifier]: taskDefintion
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newTaskIds ],
        entities: Object.assign({}, state.entities, newTaskEntities),
        selectedTaskId: state.selectedTaskId
      };
    }

    case task.LOAD: {
      const task = action.payload;

      if (state.ids.indexOf(task.identifier) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, task.identifier ],
        entities: Object.assign({}, state.entities, {
          [task.identifier]: task
        }),
        selectedTaskId: state.selectedTaskId
      };
    }

    case task.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedTaskId: action.payload
      };
    }

    case task.CREATE_SUCCESS: {
      const task = action.payload;

      return {
        ids: [ ...state.ids, task.identifier ],
        entities: Object.assign({}, state.entities, {
          [task.identifier]: task
        }),
        selectedTaskId: state.selectedTaskId
      }
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedTaskId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
