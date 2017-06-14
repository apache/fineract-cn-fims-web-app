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
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {OfficeRoutes} from './office.routing';
import {OfficeComponent} from './office.component';
import {OfficeFormComponent} from './form/form.component';
import {OfficeDetailComponent} from './detail/office.detail.component';
import {CreateOfficeFormComponent} from './form/create/create.form.component';
import {EditOfficeFormComponent} from './form/edit/edit.form.component';
import {FimsSharedModule} from '../../common/common.module';
import {HeadquarterGuard} from './headquarter/headquarter.guard';
import {HeadquarterNotFoundComponent} from './headquarter/headquarter-not-found.component';
import {OfficeExistsGuard} from './office-exists.guard';
import {Store} from '@ngrx/store';
import {OfficesStore, officeStoreFactory} from './store/index';
import {OfficeNotificationEffects} from './store/effects/notification.effects';
import {EffectsModule} from '@ngrx/effects';
import {OfficeRouteEffects} from './store/effects/route.effects';
import {OfficeApiEffects} from './store/effects/service.effects';
import {TranslateModule} from '@ngx-translate/core';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdListModule, MdRadioModule,
  MdToolbarModule
} from '@angular/material';
import {
  CovalentDataTableModule, CovalentMessageModule, CovalentSearchModule,
  CovalentStepsModule
} from '@covalent/core';
import {CommonModule} from '@angular/common';
import {TellerApiEffects} from './store/teller/effects/service.effects';
import {OfficeTellerListComponent} from './detail/teller/teller.list.component';
import {OfficeIndexComponent} from './detail/office.index.component';
import {OfficeTellerFormComponent} from './detail/teller/form/form.component';
import {CreateOfficeTellerFormComponent} from './detail/teller/form/create.form.component';
import {EditOfficeTellerFormComponent} from './detail/teller/form/edit.form.component';
import {TellerExistsGuard} from './detail/teller/teller-exists.guard';
import {TellerRouteEffects} from './store/teller/effects/route.effects';
import {TellerNotificationEffects} from './store/teller/effects/notification.effects';
import {OfficeTellerIndexComponent} from './detail/teller/teller.index.component';
import {TellerBalanceComponent} from './detail/teller/detail/balance/balance.component';
import {OfficeTellerDetailComponent} from './detail/teller/detail/teller.detail.component';
import {OpenOfficeTellerFormComponent} from './detail/teller/detail/command/open.component';
import {CloseOfficeTellerFormComponent} from './detail/teller/detail/command/close.component';
import {OfficeTellerCommandComponent} from './detail/teller/detail/command/command.component';

@NgModule({
  imports: [
    RouterModule.forChild(OfficeRoutes),
    FimsSharedModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    MdCardModule,
    MdIconModule,
    MdListModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule,
    MdRadioModule,
    CovalentSearchModule,
    CovalentStepsModule,
    CovalentDataTableModule,
    CovalentMessageModule,
    EffectsModule.run(OfficeApiEffects),
    EffectsModule.run(OfficeRouteEffects),
    EffectsModule.run(OfficeNotificationEffects),

    EffectsModule.run(TellerApiEffects),
    EffectsModule.run(TellerRouteEffects),
    EffectsModule.run(TellerNotificationEffects),
  ],
  declarations: [
    OfficeComponent,
    OfficeIndexComponent,
    OfficeFormComponent,
    CreateOfficeFormComponent,
    EditOfficeFormComponent,
    OfficeDetailComponent,
    HeadquarterNotFoundComponent,
    OfficeTellerListComponent,
    OfficeTellerFormComponent,
    OfficeTellerIndexComponent,
    OfficeTellerDetailComponent,
    CreateOfficeTellerFormComponent,
    EditOfficeTellerFormComponent,
    OfficeTellerCommandComponent,
    OpenOfficeTellerFormComponent,
    CloseOfficeTellerFormComponent,
    TellerBalanceComponent,
  ],
  providers: [
    HeadquarterGuard,
    OfficeExistsGuard,
    TellerExistsGuard,
    { provide: OfficesStore, useFactory: officeStoreFactory, deps: [Store]}
  ],
  entryComponents: []
})
export class OfficeModule {}
