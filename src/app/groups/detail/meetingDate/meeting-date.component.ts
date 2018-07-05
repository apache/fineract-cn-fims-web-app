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
import {Component, Input,Output,OnInit,EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Meeting } from '../../../services/group/domain/meeting.model';
import {Group} from '../../../services/group/domain/group.model'
import {GroupDefinition} from '../../../services/group/domain/group-definition.model';
import {Frequency, Adjustment} from '../../../services/group/domain/cycle.model'
import * as fromGroups from '../../store/index';
import {GroupsStore} from '../../store/index';
import { FrequencyOptionList } from '../../definition/domain/frequency-option-list.model';
//import {FrequencyOptionList} from '../../domain/frequency-option-list.model';


@Component({
    templateUrl:'meeting-date.component.html'
})

export class MeetingDateComponent{

    groupDefinition$: Observable<GroupDefinition>;
    group$ : Observable<Group>;

  constructor(private store: GroupsStore) {
    this.groupDefinition$ = store.select(fromGroups.getSelectedGroupDefinition);
    this.group$= store.select(fromGroups.getSelectedGroup);
  }

  formatType(type: Frequency): string {
    return FrequencyOptionList.find(option => option.type === type).label;
  }
}
    

      
