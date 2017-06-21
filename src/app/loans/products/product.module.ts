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
import {FimsSharedModule} from '../../../common/common.module';
import {ProductRoutes} from './product.routes';
import {RouterModule} from '@angular/router';
import {ProductListComponent} from './product.list.component';
import {ProductCreateComponent} from './form/create.component';
import {ProductDetailComponent} from './product.detail.component';
import {ProductEditComponent} from './form/edit.component';
import {ProductFormComponent} from './form/form.component';
import {ProductFeeFormComponent} from './form/fees/fee.component';
import {ProductInterestFormComponent} from './form/interests/interests.component';
import {ProductTermFormComponent} from './components/term/term.component';
import {ProductChargeListComponent} from './charges/charge.list.component';
import {ProductChargeDetailComponent} from './charges/charge.detail.component';
import {ProductChargeFormComponent} from './charges/form/form.component';
import {ProductChargeCreateFormComponent} from './charges/form/create.component';
import {ProductStatusComponent} from './status/status.component';
import {ProductStatusCreateFormComponent} from './status/form/create.component';
import {ProductTaskFormComponent} from './status/form/form.component';
import {ProductStatusEditFormComponent} from './status/form/edit.component';
import {ProductStatusDetailComponent} from './status/status.detail.component';
import {ProductMoratoriumFormComponent} from './form/moratorium/moratorium.component';
import {ProductChargeEditFormComponent} from './charges/form/edit.component';
import {Store} from '@ngrx/store';
import {PortfolioStore, portfolioStoreFactory} from './store/index';
import {ProductExistsGuard} from './product-exists.guard';
import {ProductTaskExistsGuard} from './status/task-exists.guard';
import {ProductChargeExistsGuard} from './charges/charge-exists.guard';
import {ProductSettingsFormComponent} from './form/settings/settings.component';
import {ProductChargesNotificationEffects} from './store/charges/effects/notification.effects';
import {ProductChargesRouteEffects} from './store/charges/effects/route.effects';
import {EffectsModule} from '@ngrx/effects';
import {ProductChargesApiEffects} from './store/charges/effects/service.effects';
import {ProductTasksNotificationEffects} from './store/tasks/effects/notification.effects';
import {ProductTasksRouteEffects} from './store/tasks/effects/route.effects';
import {ProductTasksApiEffects} from './store/tasks/effects/service.effects';
import {ProductNotificationEffects} from './store/effects/notification.effects';
import {ProductRouteEffects} from './store/effects/route.effects';
import {ProductApiEffects} from './store/effects/service.effects';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MdButtonModule, MdCheckboxModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdOptionModule,
  MdRadioModule, MdSelectModule,
  MdSlideToggleModule,
  MdToolbarModule
} from '@angular/material';
import {CovalentMessageModule, CovalentStepsModule} from '@covalent/core';
import {ProductIndexComponent} from './product.index.component';

@NgModule({
  imports: [
    RouterModule.forChild(ProductRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MdIconModule,
    MdListModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule,
    MdSlideToggleModule,
    MdRadioModule,
    MdOptionModule,
    MdSelectModule,
    MdCheckboxModule,
    CovalentStepsModule,
    CovalentMessageModule,

    EffectsModule.run(ProductApiEffects),
    EffectsModule.run(ProductRouteEffects),
    EffectsModule.run(ProductNotificationEffects),

    EffectsModule.run(ProductTasksApiEffects),
    EffectsModule.run(ProductTasksRouteEffects),
    EffectsModule.run(ProductTasksNotificationEffects),

    EffectsModule.run(ProductChargesApiEffects),
    EffectsModule.run(ProductChargesRouteEffects),
    EffectsModule.run(ProductChargesNotificationEffects),
  ],
  declarations: [
    // product
    ProductListComponent,
    ProductIndexComponent,
    ProductDetailComponent,
    ProductFormComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductFeeFormComponent,
    ProductInterestFormComponent,
    ProductTermFormComponent,
    ProductMoratoriumFormComponent,
    ProductSettingsFormComponent,

    // charge
    ProductChargeListComponent,
    ProductChargeDetailComponent,
    ProductChargeFormComponent,
    ProductChargeCreateFormComponent,
    ProductChargeEditFormComponent,

    // status
    ProductStatusComponent,
    ProductTaskFormComponent,
    ProductStatusCreateFormComponent,
    ProductStatusEditFormComponent,
    ProductStatusDetailComponent,

  ],
  providers: [
    ProductExistsGuard,
    ProductTaskExistsGuard,
    ProductChargeExistsGuard,
    { provide: PortfolioStore, useFactory: portfolioStoreFactory, deps: [Store]}
  ]
})
export class ProductModule{}
