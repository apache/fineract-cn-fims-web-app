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
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule, MdCheckboxModule,
  MdIconModule,
  MdInputModule,
  MdListModule, MdSelectModule,
  MdToolbarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {TellerRouteEffects} from './store/effects/route.effects';
import {CovalentDataTableModule, CovalentSearchModule, CovalentStepsModule} from '@covalent/core';
import {TellerCustomerExistsGuard} from './customer/teller-customer-exists.guard';
import {TellerCustomerDetailComponent} from './customer/customer-detail.component';
import {TellerProductsApiEffects} from './store/effects/products.service.effects';
import {TellerCustomerIndexComponent} from './customer/customer-index.component';
import {FimsSharedModule} from '../common/common.module';
import {TellerTransactionFormComponent} from './customer/transaction/deposit/form.component';
import {TellerNotificationEffects} from './store/effects/notification.effects';
import {LoanTransactionFormComponent} from './customer/transaction/loan/form.component';
import {CreateLoanTransactionForm} from './customer/transaction/loan/create.form.component';
import {TransactionCostComponent} from './customer/transaction/components/cost.component';
import {CreateDepositTransactionForm} from './customer/transaction/deposit/create.form.component';

@NgModule({
  imports: [
    RouterModule.forChild(TellerRoutes),
    TranslateModule,
    FimsSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdIconModule,
    MdButtonModule,
    MdInputModule,
    MdCardModule,
    MdListModule,
    MdToolbarModule,
    MdAutocompleteModule,
    MdSelectModule,
    MdCheckboxModule,
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
    CreateDepositTransactionForm,
    TellerTransactionFormComponent,
    LoanTransactionFormComponent,
    CreateLoanTransactionForm,
    TransactionCostComponent
  ],
  providers: [
    TellerLoginGuard,
    TellerCustomerExistsGuard,
    { provide: TellerStore, useFactory: tellerStoreFactory, deps: [Store]}
  ]
})
export class TellerModule { }
