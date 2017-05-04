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
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AccountCommandAction} from '../../../services/accounting/domain/account-command-action.model';
import {AccountCommand} from '../../../services/accounting/domain/account-command.model';
import {AccountingStore} from '../store/index';
import {EXECUTE_COMMAND} from '../store/account/task/task.actions';

interface StatusCommand{
  action: AccountCommandAction;
  comment?: string;
}

@Component({
  templateUrl: './status.component.html'
})
export class AccountStatusComponent implements OnInit{

  private accountIdentifier: string;

  statusCommands: StatusCommand[] = [
    { action: 'LOCK' },
    { action: 'UNLOCK' },
    { action: 'CLOSE' },
    { action: 'REOPEN' }
  ];

  constructor(private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.accountIdentifier = params['id']);
  }

  executeCommand(statusCommand: StatusCommand): void{
    let command: AccountCommand = {
      comment: statusCommand.comment,
      action: statusCommand.action
    };
    this.store.dispatch({ type: EXECUTE_COMMAND, payload: {
      accountId: this.accountIdentifier,
      command: command,
      activatedRoute: this.route
    } });
  }

}
