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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TellerRoutes} from './teller.routing';
import {RouterModule} from '@angular/router';
import {TellerStore, tellerStoreFactory} from './store/index';
import {Store} from '@ngrx/store';
import {TellerIndexComponent} from './teller.index.component';
import {TellerLoginGuard} from './teller-login.guard';
import {TellerAuthComponent} from './auth/teller-auth.component';
import {EffectsModule} from '@ngrx/effects';
import {TellerApiEffects} from './store/effects/service.effects';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {TellerRouteEffects} from './store/effects/route.effects';
import {CovalentDataTableModule, CovalentMessageModule, CovalentSearchModule, CovalentStepsModule} from '@covalent/core';
import {TellerCustomerExistsGuard} from './customer/teller-customer-exists.guard';
import {TellerCustomerDetailComponent} from './customer/customer-detail.component';
import {TellerProductsApiEffects} from './store/effects/products.service.effects';
import {TellerCustomerIndexComponent} from './customer/customer-index.component';
import {FimsSharedModule} from '../common/common.module';
import {DepositTransactionFormComponent} from './customer/transaction/deposit/form.component';
import {TellerNotificationEffects} from './store/effects/notification.effects';
import {LoanTransactionFormComponent} from './customer/transaction/loan/form.component';
import {CreateLoanTransactionFormComponent} from './customer/transaction/loan/create.form.component';
import {TransactionCostComponent} from './customer/transaction/components/cost.component';
import {CreateDepositTransactionFormComponent} from './customer/transaction/deposit/create.form.component';
import {ChequeTransactionFormComponent} from './customer/transaction/cheque/form.component';
import {CreateChequeTransactionFormComponent} from './customer/transaction/cheque/create.component';
import {TellerTransactionService} from './services/transaction.service';
import {AvailableActionService} from './services/available-actions.service';

@NgModule({
  imports: [
    RouterModule.forChild(TellerRoutes),
    TranslateModule,
    FimsSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    CovalentMessageModule,
    CovalentStepsModule,
    CovalentSearchModule,
    CovalentDataTableModule,
    EffectsModule.run(TellerApiEffects),
    EffectsModule.run(TellerRouteEffects),
    EffectsModule.run(TellerProductsApiEffects),
    EffectsModule.run(TellerNotificationEffects)
  ],
  declarations: [
    TellerIndexComponent,
    TellerAuthComponent,
    TellerCustomerIndexComponent,
    TellerCustomerDetailComponent,
    CreateDepositTransactionFormComponent,
    DepositTransactionFormComponent,
    LoanTransactionFormComponent,
    CreateLoanTransactionFormComponent,
    TransactionCostComponent,
    CreateChequeTransactionFormComponent,
    ChequeTransactionFormComponent
  ],
  providers: [
    TellerLoginGuard,
    TellerCustomerExistsGuard,
    TellerTransactionService,
    AvailableActionService,
    { provide: TellerStore, useFactory: tellerStoreFactory, deps: [Store]}
  ]
})
export class TellerModule { }
