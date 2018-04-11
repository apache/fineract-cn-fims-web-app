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
import * as fromCases from './store/index';
import {CasesStore} from './store/index';
import * as fromRoot from '../../store';
import {Observable} from 'rxjs/Observable';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';
import {FimsCase} from '../../services/portfolio/domain/fims-case.model';

@Component({
  templateUrl: './case.detail.component.html'
})
export class CaseDetailComponent implements OnInit {

  numberFormat = '1.2-2';

  caseInstance$: Observable<FimsCase>;

  canEdit$: Observable<boolean>;

  constructor(private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.caseInstance$ = this.casesStore.select(fromCases.getSelectedCase);

    this.canEdit$ = Observable.combineLatest(
      this.casesStore.select(fromRoot.getPermissions),
      this.caseInstance$,
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
      ).length > 0;
  }

}
