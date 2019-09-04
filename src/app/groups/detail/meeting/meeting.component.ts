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
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as fromGroups from '../../store/index';
import { GroupsStore } from '../../store/index';
import { Meeting } from '../../../services/group/domain/meeting.model';
import { LOAD_ALL } from '../../store/meeting/meeting.actions';
import { TableData } from '../../../common/data-table/data-table.component';
import { Subscription } from 'rxjs/Subscription';
import { Group } from '../../../services/group/domain/group.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  templateUrl: './meeting.component.html'
})
export class MeetingComponent implements OnInit {

  meetingData$: Observable<TableData>;
  meetingData: any
  group: Group;
  private groupSubscription: Subscription;
  private meetingSubscription: Subscription;


  columns: any[] = [
    { name: 'meetingSequence', label: 'Meeting Sequence' },
    { name: 'currentCycle', label: 'Current Cycle' },
    { name: 'scheduledFor', label: 'scheduledFor' },
  ]

  constructor(private store: GroupsStore, private router: Router, private route: ActivatedRoute) {
    this.groupSubscription = this.store.select(fromGroups.getSelectedGroup)
      .subscribe(group => {
        this.store.dispatch({ type: LOAD_ALL, payload: group.identifier });
      });

    this.meetingData$ = this.store.select(fromGroups.getAllMeetingEntities)
      .map(meeting => ({
        data: meeting,
        totalElements: meeting.length,
        totalPages: 1
      }));
  }

  ngOnInit() {
    this.meetingData = this.store.select(fromGroups.getAllMeetingEntities)
      .subscribe(res => console.log(res))
  }

  fetchMeetings(identifier: string): void {
    this.store.dispatch({
      type: LOAD_ALL,
      payload: this.group.identifier
    });
  }

  rowSelect(meeting: Meeting): void {
    this.router.navigate(['detail', meeting.meetingSequence], { relativeTo: this.route });
  }

}
