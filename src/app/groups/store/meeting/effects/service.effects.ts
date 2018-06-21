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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as meetingActions from '../meeting.actions';
import {GroupService} from '../../../../services/group/group.service';

@Injectable()
export class MeetingApiEffects {

  @Effect()
  createMeeting$: Observable<Action> = this.actions$
    .ofType(meetingActions.CREATE)
    .map((action: meetingActions.CreateMeetingAction) => action.payload)
    .mergeMap(payload =>
      this.groupService.createMeeting(payload.meeting)
        .map(() => new meetingActions.CreateMeetingSuccessAction({
          resource: payload.meeting,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new meetingActions.CreateMeetingFailAction(error)))
    );

  @Effect()
  updateMeeting$: Observable<Action> = this.actions$
    .ofType(meetingActions.UPDATE)
    .map((action: meetingActions.UpdateMeetingAction) => action.payload)
    .mergeMap(payload =>
      this.groupService.updateMeeting(payload.meeting)
        .map(() => new meetingActions.UpdateMeetingSuccessAction({
          resource: payload.meeting,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new meetingActions.UpdateMeetingFailAction(error)))
    );

  constructor(private actions$: Actions, private groupService: GroupService) { }

}
