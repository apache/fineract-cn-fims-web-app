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
import {OfficeComponent} from './office.component';
import {OfficeDetailComponent} from './detail/office.detail.component';
import {EditOfficeFormComponent} from './form/edit/edit.form.component';
import {CreateOfficeFormComponent} from './form/create/create.form.component';
import {HeadquarterNotFoundComponent} from './headquarter/headquarter-not-found.component';
import {HeadquarterGuard} from './headquarter/headquarter.guard';
import {OfficeExistsGuard} from './office-exists.guard';

export const OfficeRoutes: Routes = [
  { path: '', component: OfficeComponent, canActivate: [HeadquarterGuard], data: { title: 'Manage Offices', hasPermission: { id: 'office_offices', accessLevel: 'READ' } } },
  { path: 'hqNotFound', component: HeadquarterNotFoundComponent, data: { title: 'Headquarter not found' } },
  { path: 'create', component: CreateOfficeFormComponent, data: { title: 'Create office',  hasPermission: { id: 'office_offices', accessLevel: 'CHANGE' } } },
  { path: 'detail/:id/edit', component: EditOfficeFormComponent, canActivate: [OfficeExistsGuard], data: { title: 'Edit office', hasPermission: { id: 'office_offices', accessLevel: 'CHANGE' } } },
  { path: 'detail/:id', component: OfficeDetailComponent, canActivate: [OfficeExistsGuard], data: { title: 'View office', hasPermission: { id: 'office_offices', accessLevel: 'READ' } } }
];
