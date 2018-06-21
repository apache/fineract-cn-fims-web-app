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
import {ActivatedRoute, Router} from '@angular/router';
import * as fromGroups from '../store';
import {Component} from '@angular/core';
import {GroupsStore} from '../store/index';
import {GroupDefinition} from '../../services/group/domain/group-definition.model';
import {Observable} from 'rxjs/Observable';
import {LOAD_ALL} from '../store/definition/definition.actions';
import {TableData} from '../../common/data-table/data-table.component';
//import {defaultTypeOptions} from '../domain/type-options.model';

@Component({
  templateUrl: './definition.list.component.html'
})
export class GroupDefinitionListComponent {

  definitionData$: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'minimalSize', label: 'Minimum Size' },
    { name: 'maximalSize', label: 'Maximum Size' },
   // { name: 'predefined', label: 'Auto assign?' },
    
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: GroupsStore) {
    this.definitionData$ = this.store.select(fromGroups.getAllDefinitionEntities)
      .map(definitions => ({
        data: definitions,
        totalElements: definitions.length,
        totalPages: 1
      }));

    this.fetchGroupDefinitions();
  }

  fetchGroupDefinitions(): void {
    this.store.dispatch({
      type: LOAD_ALL
    });
  }

  rowSelect(definition: GroupDefinition): void {
    this.router.navigate(['detail', definition.identifier], { relativeTo: this.route });
  }
}
