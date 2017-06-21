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
import {ProductListComponent} from './product.list.component';
import {ProductCreateComponent} from './form/create.component';
import {ProductDetailComponent} from './product.detail.component';
import {ProductEditComponent} from './form/edit.component';
import {ProductChargeListComponent} from './charges/charge.list.component';
import {ProductChargeDetailComponent} from './charges/charge.detail.component';
import {ProductChargeCreateFormComponent} from './charges/form/create.component';
import {ProductStatusComponent} from './status/status.component';
import {ProductStatusCreateFormComponent} from './status/form/create.component';
import {ProductStatusEditFormComponent} from './status/form/edit.component';
import {ProductStatusDetailComponent} from './status/status.detail.component';
import {ProductChargeEditFormComponent} from './charges/form/edit.component';
import {ProductExistsGuard} from './product-exists.guard';
import {ProductTaskExistsGuard} from './status/task-exists.guard';
import {ProductChargeExistsGuard} from './charges/charge-exists.guard';
import {ProductIndexComponent} from './product.index.component';

export const ProductRoutes: Routes = [
  {path: '', component: ProductListComponent, data: { hasPermission: { id: 'portfolio_products', accessLevel: 'READ' } } /* List */},
  {path: 'create', component: ProductCreateComponent, data: { hasPermission: { id: 'portfolio_products', accessLevel: 'CHANGE' } } /* Create */},
  {
    path: 'detail/:productId', /* Parent view to resolve product */
    component: ProductIndexComponent,
    canActivate: [ProductExistsGuard],
    children: [
      {
        path: '',
        component: ProductDetailComponent /* Detail */
      },
      {
        path: 'edit',
        component: ProductEditComponent,
        data: { hasPermission: { id: 'portfolio_products', accessLevel: 'CHANGE' } }
      },
      {
        path: 'charges',
        component: ProductChargeListComponent /* Charges list view */
      },
      {
        path: 'charges/create',
        component: ProductChargeCreateFormComponent,
        data: { hasPermission: { id: 'portfolio_products', accessLevel: 'CHANGE' } } /* Charges create view */},
      {
        path: 'charges/detail/:chargeId',
        component: ProductChargeDetailComponent,
        canActivate: [ProductChargeExistsGuard]/* Charges detail view */
      },
      {
        path: 'charges/detail/:chargeId/edit',
        component: ProductChargeEditFormComponent,
        canActivate: [ProductChargeExistsGuard],
        data: { hasPermission: { id: 'portfolio_products', accessLevel: 'CHANGE' } }/* Charges detail view */},

      {
        path: 'tasks',
        component: ProductStatusComponent
      },
      {
        path: 'tasks/create', component: ProductStatusCreateFormComponent,
        data: { hasPermission: { id: 'portfolio_products', accessLevel: 'CHANGE' } }
      },
      {
        path: 'tasks/detail/:taskId',
        component: ProductStatusDetailComponent,
        canActivate: [ProductTaskExistsGuard]
      },
      {
        path: 'tasks/detail/:taskId/edit',
        component: ProductStatusEditFormComponent,
        canActivate: [ProductTaskExistsGuard],
        data: { hasPermission: { id: 'portfolio_products', accessLevel: 'CHANGE' } }
      }
    ]
  }
];
