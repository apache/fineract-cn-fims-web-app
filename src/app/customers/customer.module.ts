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
import {CustomerRoutes} from './customer.routing';
import {NgModule} from '@angular/core';
import {CustomerComponent} from './customer.component';
import {CustomerFormComponent} from './form/form.component';
import {CreateCustomerFormComponent} from './form/create/create.form.component';
import {CommonModule} from '../../components/common.module';
import {CustomerDetailComponent} from './detail/customer.detail.component';
import {CustomerDetailFormComponent} from './form/detail/detail.component';
import {CustomerAddressFormComponent} from './form/address/address.component';
import {CustomerIdentityCardFormComponent} from './form/identityCard/identity-card.component';
import {CustomerOfficesComponent} from './form/offices/offices.component';
import {CustomerEmployeesComponent} from './form/employees/employees.component';
import {CustomerContactFormComponent} from './form/contact/contact.component';
import {EditCustomerFormComponent} from './form/edit/edit.form.component';
import {CustomerCustomFieldsComponent} from './form/customFields/custom-fields.component';
import {CustomerStatusComponent} from './detail/status/status.component';
import {CustomerActivityComponent} from './detail/activity/activity.component';
import {CustomerIndexComponent} from './detail/customer.index.component';
import {CustomerTaskFormComponent} from './detail/status/form/customer-task.form.component';
import {CustomerExistsGuard} from './customer-exists.guard';
import {CustomersStore, customerStoreFactory} from './store/index';
import {Store} from '@ngrx/store';

@NgModule({
  imports: [
    RouterModule.forChild(CustomerRoutes),
    CommonModule
  ],
  declarations: [
    CustomerComponent,
    CustomerDetailFormComponent,
    CustomerAddressFormComponent,
    CustomerContactFormComponent,
    CustomerIdentityCardFormComponent,
    CustomerCustomFieldsComponent,
    CustomerOfficesComponent,
    CustomerEmployeesComponent,
    CustomerFormComponent,
    CreateCustomerFormComponent,
    CustomerTaskFormComponent,
    EditCustomerFormComponent,
    CustomerIndexComponent,
    CustomerDetailComponent,
    CustomerStatusComponent,
    CustomerActivityComponent
  ],
  providers: [
    CustomerExistsGuard,
    { provide: CustomersStore, useFactory: customerStoreFactory, deps: [Store]}
  ]
})
export class CustomerModule {}
