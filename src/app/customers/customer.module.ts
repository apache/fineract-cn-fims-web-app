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
import {RouterModule} from '@angular/router';
import {CustomerRoutes} from './customer.routing';
import {NgModule} from '@angular/core';
import {CustomerComponent} from './customer.component';
import {CustomerFormComponent} from './form/form.component';
import {CreateCustomerFormComponent} from './form/create/create.form.component';
import {FimsSharedModule} from '../common/common.module';
import {CustomerDetailComponent} from './detail/customer.detail.component';
import {CustomerDetailFormComponent} from './form/detail/detail.component';
import {CustomerOfficesComponent} from './form/offices/offices.component';
import {CustomerEmployeesComponent} from './form/employees/employees.component';
import {CustomerContactFormComponent} from './form/contact/contact.component';
import {EditCustomerFormComponent} from './form/edit/edit.form.component';
import {CustomerCustomFieldsComponent} from './form/customFields/custom-fields.component';
import {CustomerStatusComponent} from './detail/status/status.component';
import {CustomerActivityComponent} from './detail/activity/activity.component';
import {CustomerIndexComponent} from './detail/customer.index.component';
import {CustomerExistsGuard} from './customer-exists.guard';
import {CustomersStore, customerStoreFactory} from './store/index';
import {Store} from '@ngrx/store';
import {CustomerNotificationEffects} from './store/effects/notification.effects';
import {CustomerRouteEffects} from './store/effects/route.effects';
import {EffectsModule} from '@ngrx/effects';
import {CustomerApiEffects} from './store/effects/service.effects';
import {CustomerCommandApiEffects} from './store/commands/effects/service.effects';
import {CustomerTasksNotificationEffects} from './store/customerTasks/effects/notification.effects';
import {CustomerTasksApiEffects} from './store/customerTasks/effects/service.effects';
import {CustomerTasksRouteEffects} from './store/customerTasks/effects/route.effects';
import {CustomerPortraitComponent} from './detail/portrait/portrait.component';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import {CovalentChipsModule, CovalentFileModule, CovalentMessageModule, CovalentSearchModule, CovalentStepsModule} from '@covalent/core';
import {TaskListComponent} from './tasks/task.list.component';
import {TasksApiEffects} from './store/tasks/effects/service.effects';
import {TasksRouteEffects} from './store/tasks/effects/route.effects';
import {TasksNotificationEffects} from './store/tasks/effects/notification.effects';
import {TaskCreateFormComponent} from './tasks/form/create.form.component';
import {TaskEditFormComponent} from './tasks/form/edit.form.component';
import {TaskFormComponent} from './tasks/form/form.component';
import {TaskExistsGuard} from './tasks/task-exists.guard';
import {TaskIndexComponent} from './tasks/task.index.component';
import {TaskDetailComponent} from './tasks/task.detail.component';
import {CustomerTaskComponent} from './detail/status/customer-task.component';
import {CustomerPayrollFormComponent} from './detail/payroll/form/form.component';
import {CustomerPayrollDetailComponent} from './detail/payroll/payroll.detail.component';
import {CreateCustomerPayrollFormComponent} from './detail/payroll/form/create.form.component';
import {PayrollExistsGuard} from './detail/payroll/payroll-exists.guard';
import {CustomerPayrollApiEffects} from './store/payroll/effects/service.effects';
import {CustomerPayrollRouteEffects} from './store/payroll/effects/route.effects';
import {CustomerPayrollNotificationEffects} from './store/payroll/effects/notification.effects';
import {CatalogExistsGuard} from './customFields/catalog-exists.guard';
import {CreateCustomerCatalogFormComponent} from './customFields/form/create.form.component';
import {CatalogDetailComponent} from './customFields/catalog.detail.component';
import {CustomerCatalogFormComponent} from './customFields/form/form.component';
import {FieldFormComponent} from './customFields/components/field.component';
import {CatalogApiEffects} from './store/catalogs/effects/service.effects';
import {CatalogRouteEffects} from './store/catalogs/effects/route.effects';
import {CatalogNotificationEffects} from './store/catalogs/effects/notification.effects';
import {FieldFormService} from './customFields/services/field-form.service';
import {EditCatalogFieldFormComponent} from './customFields/fields/form/edit.form.component';
import {FieldDetailComponent} from './customFields/fields/field.detail.component';
import {FieldIndexComponent} from './customFields/fields/field.index.component';
import {CatalogFieldFormComponent} from './customFields/fields/form/form.component';
import {FieldExistsGuard} from './customFields/fields/field-exists.guard';
import {CustomerCustomValuesComponent} from './customFields/components/value.component';

@NgModule({
  imports: [
    RouterModule.forChild(CustomerRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    CovalentSearchModule,
    CovalentStepsModule,
    CovalentFileModule,
    CovalentMessageModule,
    CovalentChipsModule,

    EffectsModule.run(CustomerApiEffects),
    EffectsModule.run(CustomerRouteEffects),
    EffectsModule.run(CustomerNotificationEffects),

    EffectsModule.run(TasksApiEffects),
    EffectsModule.run(TasksRouteEffects),
    EffectsModule.run(TasksNotificationEffects),

    EffectsModule.run(CustomerTasksApiEffects),
    EffectsModule.run(CustomerTasksRouteEffects),
    EffectsModule.run(CustomerTasksNotificationEffects),
    EffectsModule.run(CustomerCommandApiEffects),

    EffectsModule.run(CustomerPayrollApiEffects),
    EffectsModule.run(CustomerPayrollRouteEffects),
    EffectsModule.run(CustomerPayrollNotificationEffects),

    EffectsModule.run(CatalogApiEffects),
    EffectsModule.run(CatalogRouteEffects),
    EffectsModule.run(CatalogNotificationEffects),
  ],
  declarations: [
    CustomerComponent,
    CustomerDetailFormComponent,
    CustomerContactFormComponent,
    CustomerCustomFieldsComponent,
    CustomerOfficesComponent,
    CustomerEmployeesComponent,
    CustomerFormComponent,
    CreateCustomerFormComponent,
    EditCustomerFormComponent,
    CustomerIndexComponent,
    CustomerDetailComponent,
    CustomerStatusComponent,
    CustomerActivityComponent,
    CustomerPortraitComponent,
    TaskListComponent,
    TaskIndexComponent,
    TaskCreateFormComponent,
    TaskEditFormComponent,
    TaskFormComponent,
    TaskDetailComponent,
    CustomerTaskComponent,

    CustomerPayrollDetailComponent,
    CreateCustomerPayrollFormComponent,
    CustomerPayrollFormComponent,

    CatalogDetailComponent,
    CreateCustomerCatalogFormComponent,
    CustomerCatalogFormComponent,
    CatalogFieldFormComponent,
    FieldFormComponent,
    EditCatalogFieldFormComponent,
    FieldIndexComponent,
    FieldDetailComponent,
    CustomerCustomValuesComponent
  ],
  providers: [
    FieldFormService,
    CustomerExistsGuard,
    TaskExistsGuard,
    PayrollExistsGuard,
    CatalogExistsGuard,
    FieldExistsGuard,
    { provide: CustomersStore, useFactory: customerStoreFactory, deps: [Store]}
  ]
})
export class CustomerModule {}
