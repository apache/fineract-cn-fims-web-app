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
import {FimsSharedModule} from '../../common/common.module';
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
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import {CovalentDataTableModule, CovalentMessageModule, CovalentStepsModule} from '@covalent/core';
import {ProductIndexComponent} from './product.index.component';
import {ProductDetailFormComponent} from './form/detail/detail.component';
import {ProductChargeRangeListComponent} from './charges/ranges/range.list.component';
import {ProductChargeRangeDetailComponent} from './charges/ranges/range.detail.component';
import {ProductChargeRangeFormComponent} from './charges/ranges/form/form.component';
import {EditProductChargeRangeFormComponent} from './charges/ranges/form/edit.component';
import {CreateProductChargeRangeFormComponent} from './charges/ranges/form/create.component';
import {ProductChargeRangesRouteEffects} from './store/ranges/effects/route.effects';
import {ProductChargeRangesApiEffects} from './store/ranges/effects/service.effects';
import {ProductChargeRangeExistsGuard} from './charges/ranges/range-exists.guard';
import {ProductChargeRangeIndexComponent} from './charges/ranges/range.index.component';
import {ProductChargeRangesNotificationEffects} from './store/ranges/effects/notification.effects';
import {ProductLossProvisionApiEffects} from './store/lossProvision/effects/service.effects';
import {ProductLossProvisionRouteEffects} from './store/lossProvision/effects/route.effects';
import {ProductLossProvisionNotificationEffects} from './store/lossProvision/effects/notification.effects';
import {LoanLossProvisionExistsGuard} from './lossProvision/loss-provision-exists.guard';
import {CreateProductLossProvisionFormComponent} from './lossProvision/form/create.component';
import {ProductLossProvisionFormComponent} from './lossProvision/form/form.component';
import {LossProvisionDetailComponent} from './lossProvision/loss-provision.detail.component';

@NgModule({
  imports: [
    RouterModule.forChild(ProductRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    CovalentDataTableModule,
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

    EffectsModule.run(ProductChargeRangesApiEffects),
    EffectsModule.run(ProductChargeRangesRouteEffects),
    EffectsModule.run(ProductChargeRangesNotificationEffects),

    EffectsModule.run(ProductLossProvisionApiEffects),
    EffectsModule.run(ProductLossProvisionRouteEffects),
    EffectsModule.run(ProductLossProvisionNotificationEffects),
  ],
  declarations: [
    // product
    ProductListComponent,
    ProductIndexComponent,
    ProductDetailComponent,
    ProductFormComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductDetailFormComponent,
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

    // ranges
    ProductChargeRangeListComponent,
    ProductChargeRangeIndexComponent,
    ProductChargeRangeDetailComponent,
    ProductChargeRangeFormComponent,
    CreateProductChargeRangeFormComponent,
    EditProductChargeRangeFormComponent,

    // status
    ProductStatusComponent,
    ProductTaskFormComponent,
    ProductStatusCreateFormComponent,
    ProductStatusEditFormComponent,
    ProductStatusDetailComponent,

    // Loss provision
    LossProvisionDetailComponent,
    ProductLossProvisionFormComponent,
    CreateProductLossProvisionFormComponent,
    ProductChargeDetailComponent
  ],
  providers: [
    ProductExistsGuard,
    ProductTaskExistsGuard,
    ProductChargeExistsGuard,
    ProductChargeRangeExistsGuard,
    LoanLossProvisionExistsGuard,
    { provide: PortfolioStore, useFactory: portfolioStoreFactory, deps: [Store]}
  ]
})
export class ProductModule {}
