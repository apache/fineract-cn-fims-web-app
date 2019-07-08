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
import { Component } from '@angular/core';
import { GroupDefinition } from '../../services/group/domain/group-definition.model';
import { Frequency, Adjustment } from '../../services/group/domain/cycle.model'
import { Observable } from 'rxjs/Observable';
import * as fromGroups from '../store/index';
import { GroupsStore } from '../store/index';
import { FrequencyOptionList } from './domain/frequency-option-list.model';
import { AdjustmentOptionList } from './domain/adjustment-option-list.model';

@Component({
  templateUrl: './definition.detail.component.html'
})
export class GroupDefinitionDetailComponent {

  groupDefinition$: Observable<GroupDefinition>;

  constructor(private store: GroupsStore) {
    this.groupDefinition$ = store.select(fromGroups.getSelectedGroupDefinition);
  }

  formatType(type: Frequency): string {
    return FrequencyOptionList.find(option => option.type === type).label;
  }

  formatType1(type: Adjustment): string {
    return AdjustmentOptionList.find(option => option.type === type).label;
  }

}
