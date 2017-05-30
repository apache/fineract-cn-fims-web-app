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
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import * as fromDepositAccounts from '../../store/index';
import {
  Action,
  ProductDefinitionCommand
} from '../../../../services/depositAccount/domain/definition/product-definition-command.model';
import {DepositAccountStore} from '../../store/index';
import {EXECUTE_COMMAND} from '../../store/product.actions';
import {ProductDefinition} from '../../../../services/depositAccount/domain/definition/product-definition.model';

interface StatusCommand {
  action: Action;
  comment?: string;
}

@Component({
  templateUrl: './status.component.html'
})
export class DepositProductStatusComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  private definition: ProductDefinition;

  statusCommands: StatusCommand[] = [
    { action: 'ACTIVATE' },
    { action: 'DEACTIVATE' }
  ];

  constructor(private route: ActivatedRoute, private store: DepositAccountStore) {}

  ngOnInit(): void {
    this.productSubscription = this.store.select(fromDepositAccounts.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => this.definition = product);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  executeCommand(statusCommand: StatusCommand): void {
    const command: ProductDefinitionCommand = {
      note: statusCommand.comment,
      action: statusCommand.action
    };

    this.store.dispatch({ type: EXECUTE_COMMAND, payload: {
      definitionId: this.definition.identifier,
      command,
      activatedRoute: this.route
    } });
  }

}
