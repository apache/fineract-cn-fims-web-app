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
import {DepositProductComponent} from './deposit-account.component';
import {DepositProductCreateComponent} from './form/create.component';
import {DepositProductDetailComponent} from './detail/deposit-product.detail.component';
import {ProductDefinitionExistsGuard} from './product-definition-exists.guard';
import {DepositProductStatusComponent} from './detail/status/status.component';
import {DepositProductIndexComponent} from './detail/deposit-product.index.component';
import {DepositProductEditComponent} from './form/edit.component';

export const DepositAccountRoutes: Routes = [
  {
    path: '',
    component: DepositProductComponent,
    data: { hasPermission: { id: 'deposit_definitions', accessLevel: 'READ' } },
  },
  {
    path: 'create',
    component: DepositProductCreateComponent,
    data: { hasPermission: { id: 'deposit_definitions', accessLevel: 'CHANGE' } },
  },
  {
    path: 'detail/:id',
    component: DepositProductIndexComponent,
    canActivate: [ProductDefinitionExistsGuard],
    data: { hasPermission: { id: 'deposit_definitions', accessLevel: 'READ' } },
    children: [
      {
        path: '',
        component: DepositProductDetailComponent
      },
      {
        path: 'edit',
        component: DepositProductEditComponent,
        data: { hasPermission: { id: 'deposit_definitions', accessLevel: 'CHANGE' } },
      },
      {
        path: 'tasks',
        component: DepositProductStatusComponent,
        data: { hasPermission: { id: 'deposit_definitions', accessLevel: 'CHANGE' } },
      }
    ]
  }
];
