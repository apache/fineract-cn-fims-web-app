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

import {Store} from '@ngrx/store';
import {DepositAccountStore, depositAccountStoreFactory} from './store/index';
import {DepositProductDefinitionNotificationEffects} from './store/effects/notification.effects';
import {DepositProductDefinitionRouteEffects} from './store/effects/route.effects';
import {DepositProductDefinitionApiEffects} from './store/effects/service.effects';
import {EffectsModule} from '@ngrx/effects';
import {CovalentStepsModule} from '@covalent/core';
import {MdButtonModule, MdIconModule, MdInputModule, MdListModule, MdToolbarModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FimsSharedModule} from '../../components/common.module';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {DepositAccountRoutes} from './deposit-account.routes';
import {ProductDefinitionExistsGuard} from './product-definition-exists.guard';
import {DepositProductComponent} from './deposit-account.component';

@NgModule({
  imports: [
    RouterModule.forChild(DepositAccountRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MdIconModule,
    MdListModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule,

    CovalentStepsModule,

    EffectsModule.run(DepositProductDefinitionApiEffects),
    EffectsModule.run(DepositProductDefinitionRouteEffects),
    EffectsModule.run(DepositProductDefinitionNotificationEffects)
  ],
  declarations: [
    DepositProductComponent
  ],
  providers: [
    ProductDefinitionExistsGuard,
    { provide: DepositAccountStore, useFactory: depositAccountStoreFactory, deps: [Store]}
  ]
})
export class DepositAccountModule {}
