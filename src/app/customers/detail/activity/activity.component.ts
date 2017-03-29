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

import {OnInit, Component, Input, OnDestroy} from '@angular/core';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {Command} from '../../../../services/customer/domain/command.model';
import {ActivatedRoute} from '@angular/router';
import {CustomersStore} from '../../store/index';
import {LOAD_ALL} from '../../store/commands/commands.actions';
import {SelectAction} from '../../store/customer.actions';
import {Subscription} from 'rxjs';
import * as fromCustomers from '../../store';

@Component({
  templateUrl: './activity.component.html'
})
export class CustomerActivityComponent implements OnInit, OnDestroy{

  private commandsSubscription: Subscription;

  private selectionSubscription: Subscription;

  private customerSubscription: Subscription;

  private customer: Customer;

  private commands: Command[];

  constructor(private route: ActivatedRoute, private store: CustomersStore){}

  ngOnInit(): void {
    this.selectionSubscription = this.route.parent.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .do(customer => this.store.dispatch({ type: LOAD_ALL, payload: customer.identifier }))
      .subscribe(customer => this.customer = customer);

    this.commandsSubscription = this.store.select(fromCustomers.getAllCustomerCommands)
      .subscribe(commands => this.commands = commands);
  }

  ngOnDestroy(): void {
    this.commandsSubscription.unsubscribe();
    this.selectionSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
  }
}
