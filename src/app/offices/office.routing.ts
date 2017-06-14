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
import {OfficeIndexComponent} from './detail/office.index.component';
import {OfficeTellerListComponent} from './detail/teller/teller.list.component';
import {OfficeTellerIndexComponent} from './detail/teller/teller.index.component';
import {TellerExistsGuard} from './detail/teller/teller-exists.guard';
import {EditOfficeTellerFormComponent} from './detail/teller/form/edit.form.component';
import {CreateOfficeTellerFormComponent} from './detail/teller/form/create.form.component';
import {OfficeTellerDetailComponent} from './detail/teller/detail/teller.detail.component';
import {TellerBalanceComponent} from './detail/teller/detail/balance/balance.component';
import {CloseOfficeTellerFormComponent} from './detail/teller/detail/command/close.component';
import {OfficeTellerCommandComponent} from './detail/teller/detail/command/command.component';

export const OfficeRoutes: Routes = [
  {
    path: '',
    component: OfficeComponent,
    canActivate: [HeadquarterGuard],
    data: {
      title: 'Manage offices',
      hasPermission: {id: 'office_offices', accessLevel: 'READ'}
    }
  },
  {
    path: 'hqNotFound', component: HeadquarterNotFoundComponent, data: {title: 'Headquarter not found'}
  },
  {
    path: 'create',
    component: CreateOfficeFormComponent,
    data: {title: 'Create office', hasPermission: {id: 'office_offices', accessLevel: 'CHANGE'}}
  },
  {
    path: 'detail/:id',
    component: OfficeIndexComponent,
    canActivate: [OfficeExistsGuard],
    children: [
      {
        path: '',
        component: OfficeDetailComponent,
        data: {title: 'View office', hasPermission: {id: 'office_offices', accessLevel: 'READ'}}
      },
      {
        path: 'edit',
        component: EditOfficeFormComponent,
        data: {title: 'Edit office', hasPermission: {id: 'office_offices', accessLevel: 'CHANGE'}}
      },
      {
        path: 'tellers',
        component: OfficeTellerListComponent,
        data: {title: 'Manage teller', hasPermission: {id: 'office_offices', accessLevel: 'READ'}}
      },
      {
        path: 'tellers/detail/:code',
        component: OfficeTellerIndexComponent,
        canActivate: [TellerExistsGuard],
        data: {hasPermission: {id: 'teller_management', accessLevel: 'READ'}},
        children: [
          {
            path: '',
            component: OfficeTellerDetailComponent,
            data: { title: 'View teller' }
          },
          {
            path: 'edit',
            component: EditOfficeTellerFormComponent,
            data: {title: 'Edit teller', hasPermission: {id: 'teller_management', accessLevel: 'CHANGE'}}
          },
          {
            path: 'command',
            component: OfficeTellerCommandComponent,
            data: { title: 'Manage teller', hasPermission: {id: 'teller_management', accessLevel: 'CHANGE'}}
          },
          {
            path: 'balance',
            component: TellerBalanceComponent,
            data: { title: 'View balance'}
          }
        ]
      },
      {
        path: 'tellers/create',
        component: CreateOfficeTellerFormComponent,
        data: {title: 'Create teller', hasPermission: {id: 'teller_management', accessLevel: 'CHANGE'}}
      }
    ]
  }

];
