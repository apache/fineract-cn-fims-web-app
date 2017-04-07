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
import {OnInit, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskDefinition} from '../../../../../services/customer/domain/task-definition.model';
import {Customer} from '../../../../../services/customer/domain/customer.model';
import * as fromEmployees from '../../../store';
import {Subscription} from 'rxjs';
import {ADD_TASK_TO_CUSTOMER} from '../../../store/tasks/task.actions';
import {CustomersStore} from '../../../store/index';

@Component({
  templateUrl: './customer-task.form.component.html'
})
export class CustomerTaskFormComponent implements OnInit, OnDestroy{

  private tasksSubscription: Subscription;

  private customerSubscription: Subscription;

  selectedTask: string;

  customer: Customer;

  tasks: TaskDefinition[];

  constructor(private route: ActivatedRoute, private router: Router, private store: CustomersStore) {}

  ngOnInit(): void {
    this.tasksSubscription = this.store.select(fromEmployees.getAllCustomerTaskEntities)
      .subscribe(tasks => this.tasks = tasks);

    this.customerSubscription = this.store.select(fromEmployees.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
  }

  addTask(selectedTask: string): void{
    this.store.dispatch({ type: ADD_TASK_TO_CUSTOMER, payload: {
      customerId: this.customer.identifier,
      taskId: selectedTask
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
