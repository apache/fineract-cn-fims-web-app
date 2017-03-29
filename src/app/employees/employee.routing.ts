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

import {Routes} from '@angular/router';
import {EmployeeComponent} from './employee.component';
import {CreateEmployeeFormComponent} from './form/create/create.form.component';
import {EmployeeDetailComponent} from './detail/employee.detail.component';
import {EditEmployeeFormComponent} from './form/edit/edit.form.component';
import {UserResolver} from './user.resolver';
import {EmployeeExistsGuard} from './employee-exists.guard';

export const EmployeeRoutes: Routes = [
  { path: '', component: EmployeeComponent, data: { title: 'Manage Employees', hasPermission: { id: 'office_employees', accessLevel: 'READ' } } },
  { path: 'create', component: CreateEmployeeFormComponent, data: { title: 'Create Employee', hasPermission: { id: 'office_employees', accessLevel: 'CHANGE' } } },
  { path: 'detail/:id/edit', component: EditEmployeeFormComponent, canActivate: [EmployeeExistsGuard], resolve: { user: UserResolver }, data: { title: 'Edit Employee', hasPermission: { id: 'office_employees', accessLevel: 'CHANGE' } } },
  { path: 'detail/:id', component: EmployeeDetailComponent, canActivate: [EmployeeExistsGuard], resolve: { user: UserResolver }, data: { title: 'View Employee', hasPermission: { id: 'office_employees', accessLevel: 'READ' } } }
];
