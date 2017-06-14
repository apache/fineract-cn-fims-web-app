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
import {TellerLoginGuard} from './teller-login.guard';
import {TellerAuthComponent} from './auth/teller-auth.component';
import {TellerIndexComponent} from './teller.index.component';
import {TellerCustomerDetailComponent} from './customer/customer-detail.component';
import {TellerCustomerExistsGuard} from './customer/teller-customer-exists.guard';
import {TellerCustomerIndexComponent} from './customer/customer-index.component';
import {CreateTellerTransactionForm} from './customer/transaction/create.form.component';

export const TellerRoutes: Routes = [
  {
    path: '',
    canActivate: [TellerLoginGuard],
    data: { title: 'Teller management', hasPermission: { id: 'teller_operations', accessLevel: 'READ' } },
    children: [
      {
        path: '',
        component: TellerIndexComponent
      },
      {
        path: 'customers/detail/:id',
        component: TellerCustomerIndexComponent,
        data: {
          hasPermission: { id: 'customer_customers', accessLevel: 'READ' }
        },
        canActivate: [ TellerCustomerExistsGuard ],
        children: [
          {
            path: '',
            component: TellerCustomerDetailComponent,
            data: {title: 'View Customer'}
          },
          {path: 'transaction', component: CreateTellerTransactionForm, data: { title: 'Create transaction' } },
          {path: 'identifications', loadChildren: '../customers/detail/identityCard/identity-card.module#IdentityCardModule'},
        ]
      }
    ]
  },
  {
    path: 'auth',
    component: TellerAuthComponent,
    data: { title: 'Teller login' }
  }
];
