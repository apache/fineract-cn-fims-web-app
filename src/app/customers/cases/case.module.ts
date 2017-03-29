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

import {CommonModule} from '../../../components/common.module';
import {CaseRoutes} from './case.routes';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CaseTasksComponent} from './tasks/task.component';
import {CasePaymentsComponent} from './payments/payments.component';
import {CaseDetailFormComponent} from './form/detail/detail.component';
import {CaseCreateComponent} from './form/create.component';
import {CaseFormComponent} from './form/form.component';
import {CaseListComponent} from './case.list.component';
import {CaseDetailComponent} from './case.detail.component';
import {CaseEditComponent} from './form/edit.component';
import {CasesStore, caseStoreFactory} from './store/index';
import {Store} from '@ngrx/store';
import {CaseExistsGuard} from './case-exists.guard';

@NgModule({
  imports: [
    RouterModule.forChild(CaseRoutes),
    CommonModule
  ],
  declarations: [
    CaseListComponent,
    CaseFormComponent,
    CaseCreateComponent,
    CaseEditComponent,
    CaseDetailFormComponent,
    CaseDetailComponent,
    CasePaymentsComponent,
    CaseTasksComponent
  ],
  providers: [
    CaseExistsGuard,
    { provide: CasesStore, useFactory: caseStoreFactory, deps: [Store]}
  ]
})
export class CaseModule{}
