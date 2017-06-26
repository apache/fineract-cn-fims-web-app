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

import {FimsSharedModule} from '../../../../common/common.module';
import {IdentityCardRoutes} from './identity-card.routing';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {IdentityCardExistsGuard} from './identity-card-exists.guard';
import {CustomerIdentityCardListComponent} from './identity-card.list.component';
import {CreateCustomerIdentificationCardFormComponent} from './form/create.form.component';
import {CustomerIdentityCardIndexComponent} from './identity-card.index.component';
import {CustomerIdentityCardDetailComponent} from './identity-card.detail.component';
import {EditCustomerIdentificationCardFormComponent} from './form/edit.form.component';
import {CustomerIdentificationCardNotificationEffects} from '../../store/identityCards/effects/notification.effects';
import {EffectsModule} from '@ngrx/effects';
import {CustomerIdentificationCardRouteEffects} from '../../store/identityCards/effects/route.effects';
import {CustomerIdentificationCardApiEffects} from '../../store/identityCards/effects/service.effects';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MdButtonModule, MdIconModule, MdInputModule, MdListModule, MdToolbarModule} from '@angular/material';
import {CovalentFileModule, CovalentStepsModule} from '@covalent/core';
import {IdentityCardFormComponent} from './form/identity-card-form.component';
import {IdentityCardScansFormComponent} from './form/scans/scans.component';

@NgModule({
  imports: [
    RouterModule.forChild(IdentityCardRoutes),
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
    CovalentFileModule,

    EffectsModule.run(CustomerIdentificationCardApiEffects),
    EffectsModule.run(CustomerIdentificationCardRouteEffects),
    EffectsModule.run(CustomerIdentificationCardNotificationEffects),
  ],
  declarations: [
    CustomerIdentityCardListComponent,
    CreateCustomerIdentificationCardFormComponent,
    CustomerIdentityCardIndexComponent,
    CustomerIdentityCardDetailComponent,
    EditCustomerIdentificationCardFormComponent,
    IdentityCardFormComponent,
    IdentityCardScansFormComponent
  ],
  providers: [
    IdentityCardExistsGuard
  ]
})
export class IdentityCardModule {}

