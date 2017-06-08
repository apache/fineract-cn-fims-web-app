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
import {EmployeeComponent} from './employee.component';
import {EmployeeRoutes} from './employee.routing';
import {EmployeeFormComponent} from './form/form.component';
import {CreateEmployeeFormComponent} from './form/create/create.form.component';
import {EmployeeDetailComponent} from './detail/employee.detail.component';
import {EditEmployeeFormComponent} from './form/edit/edit.form.component';
import {UserResolver} from './user.resolver';
import {FimsSharedModule} from '../../common/common.module';
import {EmployeeExistsGuard} from './employee-exists.guard';
import {Store} from '@ngrx/store';
import {EmployeesStore, employeeStoreFactory} from './store/index';
import {EmployeeNotificationEffects} from './store/effects/notification.effects';
import {EffectsModule} from '@ngrx/effects';
import {EmployeeApiEffects} from './store/effects/service.effects';
import {EmployeeRouteEffects} from './store/effects/route.effects';
import {
  MdButtonModule, MdIconModule, MdInputModule, MdListModule, MdOptionModule, MdSelectModule,
  MdToolbarModule
} from '@angular/material';
import {CovalentSearchModule, CovalentStepsModule} from '@covalent/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    RouterModule.forChild(EmployeeRoutes),
    FimsSharedModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    MdIconModule,
    MdListModule,
    MdToolbarModule,
    MdOptionModule,
    MdInputModule,
    MdButtonModule,
    MdSelectModule,
    CovalentSearchModule,
    CovalentStepsModule,

    EffectsModule.run(EmployeeApiEffects),
    EffectsModule.run(EmployeeRouteEffects),
    EffectsModule.run(EmployeeNotificationEffects)
  ],
  declarations: [
    EmployeeComponent,
    EmployeeFormComponent,
    CreateEmployeeFormComponent,
    EditEmployeeFormComponent,
    EmployeeDetailComponent
  ],
  providers: [
    UserResolver,
    EmployeeExistsGuard,
    { provide: EmployeesStore, useFactory: employeeStoreFactory, deps: [Store]}
  ]
})
export class EmployeeModule {}
