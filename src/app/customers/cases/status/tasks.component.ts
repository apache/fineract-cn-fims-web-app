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
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FimsTaskInstance} from '../store/model/fims-task-instance.model';
import {SelectTaskEvent} from './task.component';

export interface ExecuteTaskEvent {
  action: string;
  productIdentifier: string;
  caseIdentifier: string;
  taskIdentifier: string;
  executedBy: string;
  executed: boolean;
}

@Component({
  selector: 'fims-case-tasks',
  templateUrl: './tasks.component.html'
})
export class CaseTasksComponent implements OnInit {

  @Input() tasks: FimsTaskInstance[];

  @Input() action: string;

  @Input() productId: string;

  @Input() caseId: string;

  @Input() caseCreator: string;

  @Input() currentUser: string;

  @Output() onExecuteTask = new EventEmitter<ExecuteTaskEvent>();

  constructor() {}

  ngOnInit() {}

  executeTask(event: SelectTaskEvent): void {
    this.onExecuteTask.emit({
      action: this.action,
      productIdentifier: this.productId,
      caseIdentifier: this.caseId,
      taskIdentifier: event.taskIdentifier,
      executedBy: this.currentUser,
      executed: event.checked
    });
  }

  taskDisabled(task: FimsTaskInstance): boolean {
    return task.taskDefinition.fourEyes ? this.caseCreator === this.currentUser : false;
  }

  get mandatoryTasks(): FimsTaskInstance[] {
    return this.tasks.filter(task => task.taskDefinition.mandatory);
  }

  get optionalTasks(): FimsTaskInstance[] {
    return this.tasks.filter(task => !task.taskDefinition.mandatory);
  }

  get sameUser(): boolean {
    return this.caseCreator === this.currentUser;
  }
}
