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

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Group } from './domain/group.model';
import { HttpClient } from '../http/http.service';
import { GroupPage } from './domain/group-page.model';
import { FetchRequest } from '../domain/paging/fetch-request.model';
import { buildSearchParams } from '../domain/paging/search-param.builder';
import { RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { GroupCommand } from './domain/group-command.model';
import { GroupDefinition } from './domain/group-definition.model';
import { ImageService } from '../image/image.service';
import { Meeting } from './domain/meeting.model';
import { SignOffMeeting } from './domain/signoff-meeting.model';
import { Error } from '../domain/error.model';

@Injectable()
export class GroupService {

  constructor(@Inject('groupBaseUrl') private baseUrl: string, private http: HttpClient, private imageService: ImageService) {
  }

  fetchGroups(fetchRequest: FetchRequest): Observable<GroupPage> {
    const params: URLSearchParams = buildSearchParams(fetchRequest);

    const requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.get(`${this.baseUrl}/groups`, requestOptions).share()
      .catch(Error.handleError);
  }

  getGroup(id: string, silent?: boolean): Observable<Group> {
    return this.http.get(`${this.baseUrl}/groups/${id}`, {}, silent);
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post(`${this.baseUrl}/groups`, group);
  }

  updateGroup(group: Group): Observable<Group> {
    return this.http.put(`${this.baseUrl}/groups/${group.identifier}`, group);
  }

  fetchGroupCommands(identifier: string): Observable<GroupCommand[]> {
    return this.http.get(`${this.baseUrl}/groups/${identifier}/commands`);
  }

  groupCommand(identifier: string, command: GroupCommand): Observable<void> {
    return this.http.post(`${this.baseUrl}/groups/${identifier}/commands`, command);
  }

  fetchGroupDefinitions(): Observable<GroupDefinition[]> {
    return this.http.get(`${this.baseUrl}/definitions`);
  }

  getGroupDefinition(identifier: string): Observable<GroupDefinition> {
    return this.http.get(`${this.baseUrl}/definitions/${identifier}`);
  }

  createGroupDefinition(groupDefinition: GroupDefinition): Observable<void> {
    return this.http.post(`${this.baseUrl}/definitions`, groupDefinition);
  }

  updateGroupDefinition(groupDefinition: GroupDefinition): Observable<GroupDefinition> {
    return this.http.put(`${this.baseUrl}/definitions/${groupDefinition.identifier}`, groupDefinition);
  }


  fetchMeetings(identifier: string): Observable<Meeting[]> {
    return this.http.get(`${this.baseUrl}/groups/${identifier}/meetings`);
  }

  updateMeeting(identifier: string, signoff: SignOffMeeting): Observable<Meeting> {
    return this.http.put(`${this.baseUrl}/groups/${identifier}/meetings`, signoff);
  }

}
