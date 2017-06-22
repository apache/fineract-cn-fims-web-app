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

import {DepositsListComponent} from './deposits.list.component';
import {Routes} from '@angular/router';
import {DepositCreateComponent} from './form/create.component';
import {DepositIndexComponent} from './detail/deposit.index.component';
import {DepositDetailComponent} from './detail/deposit.detail.component';
import {DepositInstanceExistsGuard} from './deposit-instance-exists.guard';
import {DepositEditComponent} from './form/edit.component';

export const DepositRoutes: Routes = [
  {
    path: '',
    component: DepositsListComponent,
    data: {
      hasPermission: {id: 'deposit_instances', accessLevel: 'READ'}
    }
  },
  {
    path: 'detail/:id',
    component: DepositIndexComponent,
    canActivate: [DepositInstanceExistsGuard],
    data: {
      hasPermission: {id: 'deposit_instances', accessLevel: 'READ'}
    },
    children: [
      {
        path: '',
        component: DepositDetailComponent
      },
      {
        path: 'edit',
        component: DepositEditComponent,
        data: {
          hasPermission: {id: 'deposit_instances', accessLevel: 'CHANGE'}
        }
      }
    ]
  },
  {
    path: 'create',
    component: DepositCreateComponent,
    data: {
      hasPermission: {id: 'deposit_instances', accessLevel: 'CHANGE'}
    }
  }
];
