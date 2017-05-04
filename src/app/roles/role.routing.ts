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
import {RoleComponent} from './role.component';
import {CreateRoleFormComponent} from './form/create/create.form.component';
import {EditRoleFormComponent} from './form/edit/edit.form.component';
import {RoleExistsGuard} from './role-exists.guard';
import {RoleDetailComponent} from './detail/role.detail.component';

export const RoleRoutes: Routes = [
  { path: '', component: RoleComponent, data: { title: 'Manage roles and permissions', hasPermission: { id: 'identity_roles', accessLevel: 'READ' } } },
  { path: 'create', component: CreateRoleFormComponent, data: { title: 'Create new role', hasPermission: { id: 'identity_roles', accessLevel: 'CHANGE' } } },
  { path: 'detail/:id', component: RoleDetailComponent, canActivate: [RoleExistsGuard], data: { title: 'View role', hasPermission: { id: 'identity_roles', accessLevel: 'READ' } } },
  { path: 'detail/:id/edit', component: EditRoleFormComponent, canActivate: [RoleExistsGuard], data: { title: 'Edit role', hasPermission: { id: 'identity_roles', accessLevel: 'CHANGE' } } }
];
