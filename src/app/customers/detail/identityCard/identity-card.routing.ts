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
import {CustomerIdentityCardListComponent} from './identity-card.list.component';
import {CreateCustomerIdentificationCardFormComponent} from './form/create.form.component';
import {CustomerIdentityCardIndexComponent} from './identity-card.index.component';
import {IdentityCardExistsGuard} from './identity-card-exists.guard';
import {CustomerIdentityCardDetailComponent} from './identity-card.detail.component';
import {EditCustomerIdentificationCardFormComponent} from './form/edit.form.component';

export const IdentityCardRoutes: Routes = [
  {
    path: '',
    component: CustomerIdentityCardListComponent,
    data: {
      title: 'Manage identification cards',
      hasPermission: { id: 'customer_identifications', accessLevel: 'READ' }
    }
  },
  {
    path: 'create',
    component: CreateCustomerIdentificationCardFormComponent,
    data: {
      title: 'Create identification card',
      hasPermission: { id: 'customer_identifications', accessLevel: 'CHANGE' }
    },
  },
  {
    path: 'detail/:number',
    component: CustomerIdentityCardIndexComponent,
    canActivate: [ IdentityCardExistsGuard ],
    children: [
      {
        path: '',
        component: CustomerIdentityCardDetailComponent,
        data: {
          title: 'Identification Card',
          hasPermission: { id: 'customer_identifications', accessLevel: 'READ' }
        }
      },
      {
        path: 'edit',
        component: EditCustomerIdentificationCardFormComponent,
        data: {
          title: 'Edit identification card',
          hasPermission: {id: 'customer_identifications', accessLevel: 'CHANGE'}
        },
      }
    ]
  }
];


