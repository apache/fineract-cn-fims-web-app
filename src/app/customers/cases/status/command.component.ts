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
import {StatusCommand} from '../store/model/fims-command.model';
import {ExecuteTaskEvent} from './tasks.component';
import {WorkflowAction} from '../../../services/portfolio/domain/individuallending/workflow-action.model';

@Component({
  selector: 'fims-case-command',
  templateUrl: './command.component.html'
})

export class CaseCommandComponent implements OnInit {

  @Input() caseId: string;

  @Input() caseCreator: string;

  @Input() currentUser: string;

  @Input() productId: string;

  @Input() statusCommand: StatusCommand;

  @Output() onExecuteTask = new EventEmitter<ExecuteTaskEvent>();

  @Output() onExecuteCommand = new EventEmitter<WorkflowAction>();

  constructor() {
  }

  ngOnInit() {}

  executeTask(event: ExecuteTaskEvent): void {
    this.onExecuteTask.emit(event);
  }

  executeCommand(): void {
    this.onExecuteCommand.emit(this.statusCommand.action);
  }

  get disabled(): boolean {
    const notExecuted = this.statusCommand.tasks.filter(task => task.taskDefinition.mandatory && !task.executedOn);
    return notExecuted.length > 0;
  }
}
