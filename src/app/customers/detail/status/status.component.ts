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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Command} from '../../../services/customer/domain/command.model';
import {ActivatedRoute} from '@angular/router';
import * as fromCustomers from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {EXECUTE_COMMAND, EXECUTE_TASK, LOAD_ALL} from '../../store/customerTasks/customer-task.actions';
import {CustomersStore} from '../../store/index';
import {Observable} from 'rxjs/Observable';
import {ProcessStep} from '../../../services/customer/domain/process-step.model';
import {SelectTaskEvent} from './customer-task.component';


@Component({
  templateUrl: './status.component.html'
})
export class CustomerStatusComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  customer: Customer;

  processSteps$: Observable<ProcessStep[]>;

  constructor(private route: ActivatedRoute, private store: CustomersStore) {}

  ngOnInit(): void {
    this.processSteps$ = this.store.select(fromCustomers.getCustomerTaskProcessSteps);

    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .do(customer => this.store.dispatch({ type: LOAD_ALL, payload: customer.identifier }))
      .subscribe(customer => this.customer = customer);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  executeTask(event: SelectTaskEvent): void {
    this.store.dispatch({ type: EXECUTE_TASK, payload: {
      customerId: this.customer.identifier,
      taskId: event.taskIdentifier
    } });
  }

  executeCommand(command: Command): void {
    this.store.dispatch({ type: EXECUTE_COMMAND, payload: {
      customerId: this.customer.identifier,
      command,
      activatedRoute: this.route
    } });
  }



}
