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
import {MainComponent} from './main.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {ChangePasswordGuard} from '../../services/security/change.password.service';
import {AccessDeniedComponent} from './access.denied.component';
import {PermissionGuard} from '../../services/security/authz/permission.guard';

export const MainRoutes: Routes = [
  {
    path: '', component: MainComponent, canActivateChild: [PermissionGuard], children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent, data: { title: "Dashboard" } },
      { path: 'offices', loadChildren: './../offices/office.module#OfficeModule' },
      { path: 'employees', loadChildren: './../employees/employee.module#EmployeeModule' },
      { path: 'roles', loadChildren: './../roles/role.module#RoleModule' },
      { path: 'user', loadChildren: './../user/user.module#UserModule' },
      { path: 'customers', loadChildren: './../customers/customer.module#CustomerModule' },
      { path: 'accounting', loadChildren: './../accounting/accounting.module#AccountingModule' },
      { path: 'loans', loadChildren: './../loans/products/product.module#ProductModule' },
      { path: 'denied', component: AccessDeniedComponent, data: { title: "Not allowed" } }
    ]
  },
  {
    path: 'changePassword', loadChildren: './../user/user.module#UserModule', data: { title: "Change password" }
  }

];

export const mainRoutingProviders: any[] = [
  ChangePasswordGuard,
];
