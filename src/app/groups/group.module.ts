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
import {GroupRoutes} from './group.routing';
import {NgModule} from '@angular/core';
import {GroupComponent} from './group.component';
import {GroupFormComponent} from './form/form.component';
import {CreateGroupFormComponent} from './form/create/create.form.component';
import {FimsSharedModule} from '../common/common.module';
//import {CustomerDetailComponent} from './detail/customer.detail.component';
import {GroupDetailFormComponent} from './form/detail/detail.component';
import {GroupOfficesComponent} from './form/offices/offices.component';
import {GroupEmployeesComponent} from './form/employees/employees.component';
import {GroupCustomersComponent} from './form/customers/customers.component'
import {EditGroupFormComponent} from './form/edit/edit.form.component';
import {GroupExistsGuard} from './group-exists.guard';
import {GroupsStore, groupStoreFactory} from './store/index';
import {Store} from '@ngrx/store';
import {GroupSelectComponent} from '../common/group-select/group-select.component'
//import {CustomerNotificationEffects} from './store/effects/notification.effects';
//import {CustomerRouteEffects} from './store/effects/route.effects';
import {EffectsModule} from '@ngrx/effects';
//import {CustomerApiEffects} from './store/effects/service.effects';
import {GroupCommandApiEffects} from './store/commands/effects/service.effects';
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

@NgModule({
  imports: [
    RouterModule.forChild(GroupRoutes),
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

   // EffectsModule.run(CustomerApiEffects),
   // EffectsModule.run(CustomerRouteEffects),
///EffectsModule.run(CustomerNotificationEffects),


    EffectsModule.run(GroupCommandApiEffects),

  ],
  declarations: [
    GroupComponent,
    GroupDetailFormComponent,
    GroupOfficesComponent,
    GroupEmployeesComponent,
    GroupCustomersComponent,
    GroupFormComponent,
    CreateGroupFormComponent,
    EditGroupFormComponent,
    

  ],
  providers: [
    GroupExistsGuard,
    
    { provide: GroupsStore, useFactory: groupStoreFactory, deps: [Store]}
  ]
})
export class CustomerModule {}
