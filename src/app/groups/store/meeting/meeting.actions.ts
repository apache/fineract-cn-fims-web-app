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
import { Action } from '@ngrx/store';
import { type } from '../../../store/util';
import { Error } from '../../../services/domain/error.model';
import { Meeting } from '../../../services/group/domain/meeting.model';
import { SignOffMeeting } from '../../../services/group/domain/signoff-meeting.model';
import { RoutePayload } from '../../../common/store/route-payload';
import {
  CreateResourceSuccessPayload,
  LoadResourcePayload,
  SelectResourcePayload,
  UpdateResourceSuccessPayload
} from '../../../common/store/resource.reducer';

export const LOAD_ALL = type('[Meeting] Load All');
export const LOAD_ALL_COMPLETE = type('[Meeting] Load All Complete');

export const LOAD = type('[Meeting] Load');
export const SELECT = type('[Meeting] Select');

export const UPDATE = type('[Meeting] Update');
export const UPDATE_SUCCESS = type('[Meeting] Update Success');
export const UPDATE_FAIL = type('[Meeting] Update Fail');

export const RESET_FORM = type('[Meeting] Reset Form');

export interface MeetingRoutePayload extends RoutePayload {
  meeting: Meeting;
  groupId: string;
  signoff: SignOffMeeting
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: string) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: Meeting[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}
export class UpdateMeetingAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: MeetingRoutePayload) { }
}

export class UpdateMeetingSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateMeetingFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetMeetingFormAction implements Action {
  readonly type = RESET_FORM;

  constructor() { }
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | UpdateMeetingAction
  | UpdateMeetingSuccessAction
  | UpdateMeetingFailAction
  | ResetMeetingFormAction;
