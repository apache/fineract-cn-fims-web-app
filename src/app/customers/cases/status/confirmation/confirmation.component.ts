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
import {CostComponent} from '../../../../services/portfolio/domain/individuallending/cost-component.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {CasesStore} from '../../store/index';
import {EXECUTE_COMMAND} from '../../store/case.actions';
import {ExecuteCommandEvent} from './form.component';
import {CaseCommand} from '../../../../services/portfolio/domain/case-command.model';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import * as fromCases from '../../store/index';
import {FimsCase} from '../../../../services/portfolio/domain/fims-case.model';

interface Parameter {
  productId: string,
  caseId: string,
  action: string
}

@Component({
  templateUrl: './confirmation.component.html'
})
export class CaseCommandConfirmationComponent implements OnInit {

  fimsCase$: Observable<FimsCase>;

  costComponents$: Observable<CostComponent[]>;

  params$: Observable<Parameter>;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore, private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.params$ = this.route.params
      .map(params => ({
        productId: params['productId'],
        caseId: params['caseId'],
        action: params['action']
      }));

    this.costComponents$ = this.params$
      .flatMap(params => this.portfolioService.getCostComponentsForAction(params.productId, params.caseId, params.action));

    this.fimsCase$ = this.casesStore.select(fromCases.getSelectedCase)
  }

  executeCommand(event: ExecuteCommandEvent): void {
    const command: CaseCommand = {
      note: event.note,
      paymentSize: event.paymentSize
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
