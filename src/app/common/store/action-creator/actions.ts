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
import {Action} from '@ngrx/store';

// Actions
export interface LoadAllAction extends Action {
  payload?: any;
}

export interface LoadAllCompleteAction<T> extends Action {
  payload?: LoadAllCompleteActionPayload<T>;
}

export interface LoadAction<T> extends Action {
  payload: LoadActionPayload<T>;
}

export interface SelectAction extends Action {
  payload: SelectActionPayload;
}

export interface ResourceAction<T> extends Action {
  payload: ResourceActionPayload<T>;
}

interface DataPayload {
  data?: any;
}

// Payload
export interface LoadAllCompleteActionPayload<T> extends DataPayload {
  resources: T[];
}

export interface LoadActionPayload<T> extends DataPayload {
  resource: T;
}

export interface SelectActionPayload extends DataPayload {
  identifier: string;
}

export interface ResourceActionPayload<T> extends DataPayload {
  resource: T;
}

export interface ResourceSuccessActionPayload<T> extends DataPayload {
  resource: T;
}

export interface ResourceFailActionPayload<T> extends DataPayload {
  resource: T;
  error: Error;
}

export interface ResourceActions<T> {
  LOAD_ALL: string;
  LOAD_ALL_COMPLETE: string;
  LOAD: string;
  SELECT: string;
  CREATE: string;
  CREATE_SUCCESS: string;
  CREATE_FAIL: string;
  UPDATE: string;
  UPDATE_SUCCESS: string;
  UPDATE_FAIL: string;
  DELETE: string;
  DELETE_SUCCESS: string;
  DELETE_FAIL: string;

  loadAllAction(payload?: any): LoadAllAction;
  loadAllCompleteAction(payload?: LoadAllCompleteActionPayload<T>): LoadAllCompleteAction<T>;
  loadAction(payload: LoadActionPayload<T>): LoadAction<T>;
  selectAction(payload: SelectActionPayload): SelectAction;
  createAction(payload: ResourceActionPayload<T>): ResourceAction<T>;
  createSuccessAction(payload: ResourceSuccessActionPayload<T>): ResourceAction<T>;
  createFailAction(payload: ResourceFailActionPayload<T>): ResourceAction<T>;
  updateAction(payload: ResourceActionPayload<T>): ResourceAction<T>;
  updateSuccessAction(payload: ResourceSuccessActionPayload<T>): ResourceAction<T>;
  updateFailAction(payload: ResourceFailActionPayload<T>): ResourceAction<T>;
  deleteAction(payload: ResourceActionPayload<T>): ResourceAction<T>;
  deleteSuccessAction(payload: ResourceSuccessActionPayload<T>): ResourceAction<T>;
  deleteFailAction(payload: ResourceFailActionPayload<T>): ResourceAction<T>;
}
