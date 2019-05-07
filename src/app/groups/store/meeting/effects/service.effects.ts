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
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as meetingActions from '../meeting.actions';
import { GroupService } from '../../../../services/group/group.service';
import { map, debounceTime, skip, takeUntil, catchError, mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class MeetingApiEffects {


  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(meetingActions.LOAD_ALL)
    .pipe(
      debounceTime(300),
      map((action: meetingActions.LoadAllAction) => action.payload),
      switchMap(groupId => {
        const nextSearch$ = this.actions$.ofType(meetingActions.LOAD_ALL).pipe(skip(1));

        return this.groupService.fetchMeetings(groupId)
          .pipe(
            takeUntil(nextSearch$),
            map(meeting => new meetingActions.LoadAllCompleteAction(meeting)),
            catchError(() => of(new meetingActions.LoadAllCompleteAction([]))));
      }
      ));

  @Effect()
  updateMeeting$: Observable<Action> = this.actions$
    .ofType(meetingActions.UPDATE).pipe(
      map((action: meetingActions.UpdateMeetingAction) => action.payload),
      mergeMap(payload =>
        this.groupService.updateMeeting(payload.groupId, payload.signoff).pipe(
          map(() => new meetingActions.UpdateMeetingSuccessAction({
            resource: payload.signoff,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new meetingActions.UpdateMeetingFailAction(error))))
      ));

  constructor(private actions$: Actions, private groupService: GroupService) { }

}
