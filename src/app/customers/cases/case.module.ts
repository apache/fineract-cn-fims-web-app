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
import {FimsSharedModule} from '../../common/common.module';
import {CaseRoutes} from './case.routes';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
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
import {CaseDetailPaymentCycleComponent} from './payment-cycle/payment-cycle.component';
import {CasePaymentsApiEffects} from './store/payments/effects/service.effects';
import {EffectsModule} from '@ngrx/effects';
import {CaseTasksApiEffects} from './store/tasks/effects/service.effects';
import {CaseNotificationEffects} from './store/effects/notification.effects';
import {CaseRouteEffects} from './store/effects/route.effects';
import {CaseApiEffects} from './store/effects/service.effects';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentFileModule,
  CovalentMessageModule,
  CovalentNotificationsModule,
  CovalentStepsModule
} from '@covalent/core';
import {CaseStatusComponent} from './status/status.component';
import {CaseCreditFactorFormComponent} from './form/components/credit-factor.component';
import {CaseCoSignerFormComponent} from './form/co-signer/co-signer.component';
import {CaseDebtToIncomeFormComponent} from './form/debt-to-income/debt-to-income.component';
import {CaseDebtIncomeComponent} from './debt-income/debt-income.component';
import {CaseTasksComponent} from './status/tasks.component';
import {CaseCommandComponent} from './status/command.component';
import {CaseTasksNotificationEffects} from './store/tasks/effects/notification.effects';
import {CaseCommandConfirmationComponent} from './status/confirmation/confirmation.component';
import {CaseCommandConfirmationFormComponent} from './status/confirmation/form.component';
import {CaseTaskComponent} from './status/task.component';
import {CaseIndexComponent} from './case.index.component';
import {FeeService} from './status/services/fee.service';
import {CaseDocumentComponent} from './documents/documents.component';
import {CaseDocumentFormComponent} from './documents/form/form.component';
import {CaseDocumentEditComponent} from './documents/form/edit.component';
import {CaseDocumentCreateComponent} from './documents/form/create.component';
import {CaseDocumentIndexComponent} from './documents/document.index.component';
import {CaseDocumentDetailComponent} from './documents/document.detail.component';
import {DocumentExistsGuard} from './documents/document-exists.guard';
import {DocumentsService} from './store/documents/effects/services/documents.service';
import {CaseDocumentApiEffects} from './store/documents/effects/service.effects';
import {CaseDocumentRouteEffects} from './store/documents/effects/route.effects';
import {CaseDocumentNotificationEffects} from './store/documents/effects/notification.effects';
import {UploadPageFormComponent} from './documents/form/upload/upload-page.form.component';
import {CreateDocumentPageComponent} from './documents/form/upload/create.form.component';

@NgModule({
  imports: [
    RouterModule.forChild(CaseRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CovalentCommonModule,
    CovalentStepsModule,
    CovalentDataTableModule,
    CovalentMessageModule,
    CovalentFileModule,
    CovalentNotificationsModule,

    EffectsModule.run(CaseApiEffects),
    EffectsModule.run(CaseRouteEffects),
    EffectsModule.run(CaseNotificationEffects),

    EffectsModule.run(CaseTasksApiEffects),
    EffectsModule.run(CaseTasksNotificationEffects),
    EffectsModule.run(CasePaymentsApiEffects),

    EffectsModule.run(CaseDocumentApiEffects),
    EffectsModule.run(CaseDocumentRouteEffects),
    EffectsModule.run(CaseDocumentNotificationEffects),

  ],
  declarations: [
    CaseListComponent,
    CaseIndexComponent,
    CaseFormComponent,
    CaseCreateComponent,
    CaseEditComponent,
    CaseDetailFormComponent,
    CaseDetailComponent,
    CaseDetailPaymentCycleComponent,
    CasePaymentsComponent,
    CaseCommandComponent,
    CaseTasksComponent,
    CaseTaskComponent,
    CaseCommandConfirmationComponent,
    CaseCommandConfirmationFormComponent,
    CaseStatusComponent,
    CaseDebtToIncomeFormComponent,
    CaseCreditFactorFormComponent,
    CaseCoSignerFormComponent,
    CaseDebtIncomeComponent,
    CaseDocumentComponent,
    CaseDocumentIndexComponent,
    CaseDocumentDetailComponent,
    CaseDocumentFormComponent,
    CaseDocumentCreateComponent,
    CaseDocumentEditComponent,
    CreateDocumentPageComponent,
    UploadPageFormComponent
  ],
  providers: [
    CaseExistsGuard,
    DocumentExistsGuard,
    FeeService,
    DocumentsService,
    { provide: CasesStore, useFactory: caseStoreFactory, deps: [Store]}
  ]
})
export class CaseModule {}
