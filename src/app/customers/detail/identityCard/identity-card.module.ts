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
import {FimsSharedModule} from '../../../common/common.module';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDatepickerModule, MatIconModule, MatInputModule, MatListModule, MatToolbarModule} from '@angular/material';
import {CovalentFileModule, CovalentStepsModule} from '@covalent/core';
import {IdentityCardFormComponent} from './form/identity-card-form.component';
import {CustomerIdentityCardScanListComponent} from './scans/scan.list.component';
import {CustomerIdentificationCardScanApiEffects} from '../../store/identityCards/scans/effects/service.effects';
import {CustomerIdentificationCardScanNotificationEffects} from '../../store/identityCards/scans/effects/notification.effects';
import {CreateIdentificationCardScanComponent} from './scans/form/create.form.component';
import {IdentificationCardScanComponent} from './scans/form/scan.form.component';
import {CustomerIdentificationCardScanRouteEffects} from '../../store/identityCards/scans/effects/route.effects';

@NgModule({
  imports: [
    RouterModule.forChild(IdentityCardRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CovalentStepsModule,
    CovalentFileModule,

    EffectsModule.run(CustomerIdentificationCardApiEffects),
    EffectsModule.run(CustomerIdentificationCardRouteEffects),
    EffectsModule.run(CustomerIdentificationCardNotificationEffects),

    EffectsModule.run(CustomerIdentificationCardScanApiEffects),
    EffectsModule.run(CustomerIdentificationCardScanRouteEffects),
    EffectsModule.run(CustomerIdentificationCardScanNotificationEffects)
  ],
  declarations: [
    CustomerIdentityCardListComponent,
    CreateCustomerIdentificationCardFormComponent,
    CustomerIdentityCardIndexComponent,
    CustomerIdentityCardDetailComponent,
    EditCustomerIdentificationCardFormComponent,
    IdentityCardFormComponent,
    CustomerIdentityCardScanListComponent,
    CreateIdentificationCardScanComponent,
    IdentificationCardScanComponent
  ],
  providers: [
    IdentityCardExistsGuard
  ]
})
export class IdentityCardModule {}

