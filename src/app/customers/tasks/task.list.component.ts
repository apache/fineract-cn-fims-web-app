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
import * as fromCustomers from '../store';
import {Component} from '@angular/core';
import {CustomersStore} from '../store/index';
import {TaskDefinition, TaskDefinitionType} from '../../services/customer/domain/task-definition.model';
import {Observable} from 'rxjs/Observable';
import {LOAD_ALL} from '../store/tasks/task.actions';
import {TableData} from '../../common/data-table/data-table.component';
import {defaultTypeOptions} from './domain/type-options.model';

@Component({
  templateUrl: './task.list.component.html'
})
export class TaskListComponent {

  tasksData$: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'mandatory', label: 'Mandatory?' },
    { name: 'predefined', label: 'Auto assign?' },
    { name: 'type', label: 'Type',
      format: (value: TaskDefinitionType) =>
        defaultTypeOptions.find(option => option.type === value).label
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: CustomersStore) {
    this.tasksData$ = this.store.select(fromCustomers.getAllTaskEntities)
      .map(tasks => ({
        data: tasks,
        totalElements: tasks.length,
        totalPages: 1
      }));

    this.fetchTasks();
  }

  fetchTasks(): void {
    this.store.dispatch({
      type: LOAD_ALL
    });
  }

  rowSelect(task: TaskDefinition): void {
    this.router.navigate(['detail', task.identifier], { relativeTo: this.route });
  }
}
