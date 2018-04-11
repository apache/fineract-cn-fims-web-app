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
import {Routes} from '@angular/router';
import {CasePaymentsComponent} from './payments/payments.component';
import {CaseDetailComponent} from './case.detail.component';
import {CaseCreateComponent} from './form/create.component';
import {CaseListComponent} from './case.list.component';
import {CaseEditComponent} from './form/edit.component';
import {CaseExistsGuard} from './case-exists.guard';
import {CaseStatusComponent} from './status/status.component';
import {CaseDebtIncomeComponent} from './debt-income/debt-income.component';
import {CaseCommandConfirmationComponent} from './status/confirmation/confirmation.component';
import {CaseIndexComponent} from './case.index.component';
import {CaseDocumentComponent} from './documents/documents.component';
import {CaseDocumentIndexComponent} from './documents/document.index.component';
import {CaseDocumentDetailComponent} from './documents/document.detail.component';
import {CaseDocumentCreateComponent} from './documents/form/create.component';
import {CaseDocumentEditComponent} from './documents/form/edit.component';
import {DocumentExistsGuard} from './documents/document-exists.guard';
import {CreateDocumentPageComponent} from './documents/form/upload/create.form.component';

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
    component: CaseIndexComponent,
    canActivate: [CaseExistsGuard],
    data: {
      hasPermission: {id: 'portfolio_cases', accessLevel: 'READ'}
    },
    children: [
      {
        path: '', component: CaseDetailComponent
      },
      {
        path: 'edit',
        component: CaseEditComponent,
        data: {
          hasPermission: {id: 'portfolio_cases', accessLevel: 'CHANGE'}
        }
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
        path: 'tasks/:action/confirmation',
        component: CaseCommandConfirmationComponent,
        data: {
          hasPermission: {id: 'portfolio_cases', accessLevel: 'CHANGE'}
        }
      },
      {
        path: 'debtIncome',
        component: CaseDebtIncomeComponent
      },
      {
        path: 'documents',
        component: CaseDocumentComponent,
        data: {
          hasPermission: {id: 'portfolio_documents', accessLevel: 'READ'}
        }
      },
      {
        path: 'documents/detail/:documentId',
        component: CaseDocumentIndexComponent,
        canActivate: [DocumentExistsGuard],
        data: {
          hasPermission: {id: 'portfolio_documents', accessLevel: 'READ'}
        },
        children: [
          {
            path: '',
            component: CaseDocumentDetailComponent
          },
          {
            path: 'edit',
            component: CaseDocumentEditComponent,
            data: {
              hasPermission: {id: 'portfolio_documents', accessLevel: 'CHANGE'}
            }
          },
          {
            path: 'upload',
            component: CreateDocumentPageComponent,
            data: {
              hasPermission: {id: 'portfolio_documents', accessLevel: 'CHANGE'}
            }
          }
        ]
      },
      {
        path: 'documents/create',
        component: CaseDocumentCreateComponent,
        data: {
          hasPermission: {id: 'portfolio_documents', accessLevel: 'CHANGE'}
        }
      }
    ]
  }

];
