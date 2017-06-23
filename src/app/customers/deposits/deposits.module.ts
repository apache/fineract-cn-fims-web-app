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

import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FimsSharedModule} from '../../../common/common.module';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdOptionModule,
  MdRadioModule,
  MdSelectModule,
  MdToolbarModule
} from '@angular/material';
import {CovalentChipsModule, CovalentCommonModule, CovalentStepsModule} from '@covalent/core';
import {DepositCreateComponent} from './form/create.component';
import {DepositFormComponent} from './form/form.component';
import {DepositsListComponent} from './deposits.list.component';
import {Store} from '@ngrx/store';
import {DepositsStore, depositsStoreFactory} from './store/index';
import {DepositRoutes} from './deposits.routes';
import {EffectsModule} from '@ngrx/effects';
import {DepositProductInstanceApiEffects} from './store/effects/service.effects';
import {DepositProductInstanceRouteEffects} from './store/effects/route.effects';
import {DepositProductInstanceNotificationEffects} from './store/effects/notification.effects';
import {DepositIndexComponent} from './detail/deposit.index.component';
import {DepositDetailComponent} from './detail/deposit.detail.component';
import {DepositInstanceExistsGuard} from './deposit-instance-exists.guard';
import {DepositEditComponent} from './form/edit.component';

@NgModule({
  imports: [
    RouterModule.forChild(DepositRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MdIconModule,
    MdListModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule,
    MdOptionModule,
    MdSelectModule,
    MdRadioModule,
    MdCardModule,
    CovalentCommonModule,
    CovalentStepsModule,
    CovalentChipsModule,

    EffectsModule.run(DepositProductInstanceApiEffects),
    EffectsModule.run(DepositProductInstanceRouteEffects),
    EffectsModule.run(DepositProductInstanceNotificationEffects),
  ],
  declarations: [
    DepositsListComponent,
    DepositFormComponent,
    DepositIndexComponent,
    DepositCreateComponent,
    DepositEditComponent,
    DepositDetailComponent
  ],
  providers: [
    DepositInstanceExistsGuard,
    { provide: DepositsStore, useFactory: depositsStoreFactory, deps: [Store] }
  ]
})
export class DepositsModule {}
