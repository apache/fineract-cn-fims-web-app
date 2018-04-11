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
import {Component} from '@angular/core';
import {TaskDefinition, TaskDefinitionCommand, TaskDefinitionType} from '../../services/customer/domain/task-definition.model';
import {Observable} from 'rxjs/Observable';
import * as fromCustomers from '../store/index';
import {CustomersStore} from '../store/index';
import {defaultCommandOptions} from './domain/command-options.model';
import {defaultTypeOptions} from './domain/type-options.model';

@Component({
  templateUrl: './task.detail.component.html'
})
export class TaskDetailComponent {

  task$: Observable<TaskDefinition>;

  constructor(private store: CustomersStore) {
    this.task$ = store.select(fromCustomers.getSelectedTask);
  }

  formatType(type: TaskDefinitionType): string {
    return defaultTypeOptions.find(option => option.type === type).label;
  }

  formatCommands(commands: TaskDefinitionCommand[]): string {
    const options = commands.map(command =>
      defaultCommandOptions.find(option => option.command === command).label
    );

    return options.join(', ');
  }
}
