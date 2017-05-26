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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskDefinition} from '../../../../services/customer/domain/task-definition.model';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {Command, CommandAction} from '../../../../services/customer/domain/command.model';
import {CustomerState} from '../../../../services/customer/domain/customer-state.model';
import {ActivatedRoute} from '@angular/router';
import * as fromCustomers from '../../store';
import {Subscription} from 'rxjs';
import {EXECUTE_COMMAND, EXECUTE_TASK, LOAD_ALL} from '../../store/tasks/task.actions';
import {CustomersStore} from '../../store/index';

interface StatusCommand {
  action: CommandAction;
  comment?: string;
  tasks: TaskDefinition[];
  preStates: CustomerState[]
}

@Component({
  templateUrl: './status.component.html'
})
export class CustomerStatusComponent implements OnInit, OnDestroy {

  private tasksSubscription: Subscription;

  private customerSubscription: Subscription;

  customer: Customer;

  statusCommands: StatusCommand[] = [
    { action: 'ACTIVATE', preStates: ['PENDING'], tasks: []},
    { action: 'LOCK', preStates: ['ACTIVE'], tasks: []},
    { action: 'UNLOCK', preStates: ['LOCKED'], tasks: []},
    { action: 'CLOSE', preStates: ['LOCKED', 'ACTIVE'], tasks: []},
    { action: 'REOPEN', preStates: ['CLOSED'], tasks: []},
  ];

  constructor(private route: ActivatedRoute, private store: CustomersStore) {}

  ngOnInit(): void {
    this.tasksSubscription = this.store.select(fromCustomers.getAllCustomerTaskEntities)
      .subscribe(tasks => this.mergeTasks(tasks));

    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .do(customer => this.store.dispatch({ type: LOAD_ALL, payload: customer.identifier }))
      .subscribe(customer => this.customer = customer);
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
  }

  private mergeTasks(tasks: TaskDefinition[]): void {
    for(let statusCommand of this.statusCommands){
      statusCommand.tasks = [];
      let foundTasks = tasks.filter((task: TaskDefinition) => task.commands.indexOf(statusCommand.action) > -1);
      statusCommand.tasks.push(...foundTasks);
    }
  }

  executeTask(taskId: string): void {
    this.store.dispatch({ type: EXECUTE_TASK, payload: {
      customerId: this.customer.identifier,
      taskId: taskId
    } });
  }

  executeCommand(statusCommand: StatusCommand): void {
    let command: Command = {
      comment: statusCommand.comment,
      action: statusCommand.action
    };

    this.store.dispatch({ type: EXECUTE_COMMAND, payload: {
      customerId: this.customer.identifier,
      command: command,
      activatedRoute: this.route
    } });
  }

}
