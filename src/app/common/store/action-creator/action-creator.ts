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
import {type} from '../../../store/util';
import {
  LoadAction,
  LoadActionPayload,
  LoadAllAction,
  LoadAllCompleteAction,
  LoadAllCompleteActionPayload,
  ResourceAction,
  ResourceActionPayload,
  ResourceActions,
  SelectAction,
  SelectActionPayload
} from './actions';

export type Actions<T> = LoadAllAction | LoadAllCompleteAction<T>;

export function createResourceActions<T>(name: string): ResourceActions<T> {

  const LOAD_ALL = type(`[${name}] Load All`);
  const LOAD_ALL_COMPLETE = type(`[${name}] Load All Complete`);

  const LOAD = type(`[${name}] Load`);

  const SELECT = type(`[${name}] Select`);

  const CREATE = type(`[${name}] Create`);
  const CREATE_SUCCESS = type(`[${name}] Create Success`);
  const CREATE_FAIL = type(`[${name}] Create Fail`);

  const UPDATE = type(`[${name}] Update`);
  const UPDATE_SUCCESS = type(`[${name}] Update Success`);
  const UPDATE_FAIL = type(`[${name}] Update Fail`);

  const DELETE = type(`[${name}] Delete`);
  const DELETE_SUCCESS = type(`[${name}] Delete Success`);
  const DELETE_FAIL = type(`[${name}] Delete Fail`);

  function loadAllAction(payload?: any): LoadAllAction {
    return {
      payload,
      type: LOAD_ALL
    };
  }

  function loadAllCompleteAction(payload?: LoadAllCompleteActionPayload<T>): LoadAllCompleteAction<T> {
    return {
      payload,
      type: LOAD_ALL_COMPLETE
    };
  }

  function loadAction(payload: LoadActionPayload<T>): LoadAction<T> {
    return {
      payload,
      type: LOAD
    };
  }

  function selectAction(payload: SelectActionPayload): SelectAction {
    return {
      payload,
      type: SELECT
    };
  }

  function createAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: CREATE
    };
  }

  function createSuccessAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: CREATE_SUCCESS
    };
  }

  function createFailAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: CREATE_FAIL
    };
  }

  function updateAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: UPDATE
    };
  }

  function updateSuccessAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: UPDATE_SUCCESS
    };
  }

  function updateFailAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: UPDATE_FAIL
    };
  }

  function deleteAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: DELETE
    };
  }

  function deleteSuccessAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: DELETE_SUCCESS
    };
  }

  function deleteFailAction(payload: ResourceActionPayload<T>): ResourceAction<T> {
    return {
      payload,
      type: DELETE_FAIL
    };
  }

  return {
    LOAD_ALL,
    LOAD_ALL_COMPLETE,
    LOAD,
    SELECT,
    CREATE,
    CREATE_SUCCESS,
    CREATE_FAIL,
    UPDATE,
    UPDATE_SUCCESS,
    UPDATE_FAIL,
    DELETE,
    DELETE_SUCCESS,
    DELETE_FAIL,
    loadAllAction,
    loadAllCompleteAction,
    loadAction,
    selectAction,
    createAction,
    createSuccessAction,
    createFailAction,
    updateAction,
    updateSuccessAction,
    updateFailAction,
    deleteAction,
    deleteSuccessAction,
    deleteFailAction
  };
}


