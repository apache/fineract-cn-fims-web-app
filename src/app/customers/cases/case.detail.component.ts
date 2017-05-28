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
import {ActivatedRoute} from '@angular/router';
import * as fromCases from './store/index';
import * as fromRoot from '../../reducers';
import {CasesStore} from './store/index';
import {Subscription} from 'rxjs';
import {SelectAction} from './store/case.actions';
import {FimsCase} from './store/model/fims-case.model';
import {Observable} from 'rxjs/Observable';
import {FimsPermission} from '../../../services/security/authz/fims-permission.model';

@Component({
  templateUrl: './case.detail.component.html'
})
export class CaseDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private caseSubscription: Subscription;

  caseInstance: FimsCase;

  canEdit$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['caseId']))
      .subscribe(this.casesStore);

    const case$: Observable<FimsCase> = this.casesStore.select(fromCases.getSelectedCase);

    this.caseSubscription = case$
      .subscribe(caseInstance => this.caseInstance = caseInstance);

    this.canEdit$ = Observable.combineLatest(
      this.casesStore.select(fromRoot.getPermissions),
      case$,
      (permissions, caseInstance: FimsCase) => ({
        hasPermission: this.hasChangePermission(permissions),
        isCreatedOrPending: caseInstance.currentState === 'PENDING' || caseInstance.currentState === 'CREATED'
      }))
      .map(result => result.hasPermission && result.isCreatedOrPending);
  }

  private hasChangePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
        permission.id === 'portfolio_cases' &&
        permission.accessLevel === 'CHANGE'
      ).length > 0
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.caseSubscription.unsubscribe();
  }

  disburse(): void{
    // TODO: Implement when API available
  }

}
