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
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import * as fromRoot from '../../../store';
import {Observable} from 'rxjs/Observable';
import {EXECUTE_TASK, LoadAllAction} from '../store/tasks/task.actions';
import {ExecuteTaskEvent} from './tasks.component';
import {StatusCommand} from '../store/model/fims-command.model';
import {WorkflowAction} from '../../../services/portfolio/domain/individuallending/workflow-action.model';
import {FimsCase} from '../../../services/portfolio/domain/fims-case.model';

@Component({
  templateUrl: './status.component.html'
})
export class CaseStatusComponent implements OnInit, OnDestroy {

  private actionSubscription: Subscription;

  currentUser$: Observable<string>;

  productId$: Observable<string>;

  caseInstance$: Observable<FimsCase>;

  statusCommands$: Observable<StatusCommand[]>;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.productId$ = this.route.parent.params
      .map(params => params['productId']);

    this.currentUser$ = this.casesStore.select(fromRoot.getUsername);

    this.caseInstance$ = this.casesStore.select(fromCases.getSelectedCase);

    this.statusCommands$ = this.casesStore.select(fromCases.getCaseCommands);

    this.actionSubscription = Observable.combineLatest(
      this.productId$,
      this.caseInstance$,
      (productId, caseInstance) => ({
        productId,
        caseId: caseInstance.identifier
      })
    ).map(({ productId, caseId }) => new LoadAllAction({
      productId,
      caseId
    })).subscribe(this.casesStore);
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  executeCommand(action: WorkflowAction): void {
    this.router.navigate([action, 'confirmation'], {
      relativeTo: this.route
    });
  }

  executeTask(event: ExecuteTaskEvent): void {
    this.casesStore.dispatch({
      type: EXECUTE_TASK,
      payload: event
    });
  }

}
