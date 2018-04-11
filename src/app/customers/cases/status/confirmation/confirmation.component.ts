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
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromCases from '../../store/index';
import {CasesStore} from '../../store/index';
import {EXECUTE_COMMAND} from '../../store/case.actions';
import {ExecuteCommandEvent} from './form.component';
import {CaseCommand} from '../../../../services/portfolio/domain/case-command.model';
import {FimsCase} from '../../../../services/portfolio/domain/fims-case.model';
import {Fee} from '../services/domain/fee.model';
import {FeeService} from '../services/fee.service';

interface Parameter {
  productId: string;
  caseId: string;
  action: string;
}

@Component({
  templateUrl: './confirmation.component.html'
})
export class CaseCommandConfirmationComponent implements OnInit {

  fimsCase$: Observable<FimsCase>;

  fees$: Observable<Fee[]>;

  params$: Observable<Parameter>;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore,
              private feeService: FeeService) {}

  ngOnInit() {
    const parentParams$ = this.route.parent.params
      .map(params => ({
        caseId: params['caseId'],
        productId: params['productId']
      }));

    this.params$ = this.route.params
      .map(params => ({
        action: params['action']
      }));

    this.fees$ = Observable.combineLatest(
      parentParams$,
      this.params$,
      (parentParams, params) => ({
        productId: parentParams.productId,
        caseId: parentParams.caseId,
        action: params.action
      }))
      .switchMap(params => this.feeService.getFees(params.productId, params.caseId, params.action));

    this.fimsCase$ = this.casesStore.select(fromCases.getSelectedCase);
  }

  executeCommand(event: ExecuteCommandEvent): void {
    const command: CaseCommand = {
      note: event.note,
      paymentSize: event.paymentSize,
      createdOn: event.createdOn
    };

    this.casesStore.dispatch({ type: EXECUTE_COMMAND, payload: {
      productId: event.productId,
      caseId: event.caseId,
      action: event.action,
      command: command,
      activatedRoute: this.route
    } });
  }

  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
