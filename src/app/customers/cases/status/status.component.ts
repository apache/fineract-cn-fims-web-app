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
import {WorkflowAction} from '../../../../services/portfolio/domain/individuallending/workflow-action.model';
import {CaseState} from '../../../../services/portfolio/domain/case-state.model';
import {Subscription} from 'rxjs/Subscription';
import {FimsCase} from '../store/model/fims-case.model';
import {ActivatedRoute} from '@angular/router';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import {CaseCommand} from '../../../../services/portfolio/domain/case-command.model';
import {EXECUTE_COMMAND} from '../store/case.actions';

interface StatusCommand {
  action: WorkflowAction;
  comment?: string;
  preStates: CaseState[]
}

@Component({
  templateUrl: './status.component.html'
})
export class CaseStatusComponent implements OnInit, OnDestroy {

  private caseSubscription: Subscription;

  private productId: string;

  caseInstance: FimsCase;

  statusCommands: StatusCommand[] = [
    { action: 'OPEN', preStates: ['CREATED']},
    { action: 'APPROVE', preStates: ['PENDING']},
    { action: 'DENY', preStates: ['PENDING']},
    { action: 'CLOSE', preStates: ['APPROVED', 'ACTIVE']}
  ];

  constructor(private route: ActivatedRoute, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.caseSubscription = this.casesStore.select(fromCases.getSelectedCase)
      .subscribe(caseInstance => this.caseInstance = caseInstance);

    this.route.params.subscribe(params => this.productId = params['productId']);
  }

  ngOnDestroy(): void {
    this.caseSubscription.unsubscribe();
  }

  executeCommand(statusCommand: StatusCommand): void {
    const command: CaseCommand = {
      comment: statusCommand.comment
    };

    this.casesStore.dispatch({ type: EXECUTE_COMMAND, payload: {
      productId: this.productId,
      caseId: this.caseInstance.identifier,
      action: statusCommand.action,
      command: command,
      activatedRoute: this.route
    } });
  }

}
