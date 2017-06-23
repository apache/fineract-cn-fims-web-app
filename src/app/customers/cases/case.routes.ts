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

import {Routes} from '@angular/router';
import {CaseTasksComponent} from './tasks/task.component';
import {CasePaymentsComponent} from './payments/payments.component';
import {CaseDetailComponent} from './case.detail.component';
import {CaseCreateComponent} from './form/create.component';
import {CaseListComponent} from './case.list.component';
import {CaseEditComponent} from './form/edit.component';
import {CaseExistsGuard} from './case-exists.guard';
import {CaseStatusComponent} from './status/status.component';
import {CaseDebtIncomeComponent} from './debt-income/debt-income.component';

export const CaseRoutes: Routes = [
  {
    path: '',
    component: CaseListComponent,
    data: {
      hasPermission: {id: 'portfolio_cases', accessLevel: 'READ'}
    }
  },
  {
    path: 'create',
    component: CaseCreateComponent,
    data: {
      hasPermission: {id: 'portfolio_cases', accessLevel: 'CHANGE'}
    }
  },
  {
    path: 'products/:productId/detail/:caseId',
    canActivate: [CaseExistsGuard],
    data: {
      hasPermission: {id: 'portfolio_cases', accessLevel: 'READ'}
    },
    children: [
      {
        path: '', component: CaseDetailComponent
      },
      {
        path: 'payments', component: CasePaymentsComponent
      },
      {
        path: 'tasks',
        component: CaseStatusComponent,
        data: {
          hasPermission: {id: 'portfolio_cases', accessLevel: 'CHANGE'}
        }
      },
      {
        path: 'debtIncome',
        component: CaseDebtIncomeComponent
      }
    ]
  },
  {
    path: 'products/:productId/detail/:caseId/edit',
    component: CaseEditComponent,
    canActivate: [CaseExistsGuard],
    data: {
      hasPermission: {id: 'portfolio_cases', accessLevel: 'CHANGE'}
    }
  }
];
