/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TaskDefinition, TaskDefinitionType} from '../../../services/customer/domain/task-definition.model';
import {MdCheckboxChange} from '@angular/material';
import {defaultTypeOptions} from '../../tasks/domain/type-options.model';

export interface SelectTaskEvent {
  taskIdentifier: string;
  checked: boolean;
}

@Component({
  selector: 'fims-customer-task',
  templateUrl: './customer-task.component.html'
})
export class CustomerTaskComponent {

  @Input() task: TaskDefinition;

  @Input() disabled: boolean;

  @Output() onSelectTask = new EventEmitter<SelectTaskEvent>();

  constructor() {}

  selectTask(change: MdCheckboxChange): void {
    this.onSelectTask.emit({
      taskIdentifier: this.task.identifier,
      checked: change.checked
    });
  }

  formatType(type: TaskDefinitionType): string {
    return defaultTypeOptions.find(option => option.type === type).label;
  }
}
