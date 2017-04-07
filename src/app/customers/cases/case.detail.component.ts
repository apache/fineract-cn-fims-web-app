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
import {ActivatedRoute} from '@angular/router';
import {Case} from '../../../services/portfolio/domain/case.model';
import {CasesStore} from './store/index';
import * as fromCases from './store/index';
import {Subscription} from 'rxjs';
import {SelectAction} from './store/case.actions';
import {FimsCase} from './store/model/fims-case.model';
import {monthOptions} from '../../../components/domain/months.model';
import {weekDayOptions} from '../../../components/domain/week-days.model';
import {alignmentOptions} from '../../../components/domain/alignment.model';
import {temporalOptionList} from '../../../components/domain/temporal.domain';
import {ChronoUnit} from '../../../services/portfolio/domain/chrono-unit.model';

@Component({
  templateUrl: './case.detail.component.html'
})
export class CaseDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private caseSubscription: Subscription;

  caseInstance: FimsCase;

  constructor(private route: ActivatedRoute, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['caseId']))
      .subscribe(this.casesStore);

    this.caseSubscription = this.casesStore.select(fromCases.getSelectedCase)
      .subscribe(caseInstance => this.caseInstance = caseInstance);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.caseSubscription.unsubscribe();
  }

  disburse(): void{
    // TODO: Implement when API available
  }

  repay(): void{
    // TODO: Implement when API available
  }

}
