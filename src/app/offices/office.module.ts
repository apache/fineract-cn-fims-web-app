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

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {OfficeRoutes} from './office.routing';
import {OfficeComponent} from './office.component';
import {OfficeFormComponent} from './form/form.component';
import {OfficeDetailComponent} from './detail/office.detail.component';
import {CreateOfficeFormComponent} from './form/create/create.form.component';
import {EditOfficeFormComponent} from './form/edit/edit.form.component';
import {CommonModule} from '../../components/common.module';
import {HeadquarterGuard} from './headquarter/headquarter.guard';
import {HeadquarterNotFoundComponent} from './headquarter/headquarter-not-found.component';
import {OfficeExistsGuard} from './office-exists.guard';
import {Store} from '@ngrx/store';
import {OfficesStore, officeStoreFactory} from './store/index';

@NgModule({
  imports: [
    RouterModule.forChild(OfficeRoutes),
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    OfficeComponent,
    OfficeFormComponent,
    CreateOfficeFormComponent,
    EditOfficeFormComponent,
    OfficeDetailComponent,
    HeadquarterNotFoundComponent
  ],
  providers: [
    HeadquarterGuard,
    OfficeExistsGuard,
    { provide: OfficesStore, useFactory: officeStoreFactory, deps: [Store]}
  ],
  entryComponents: []
})
export class OfficeModule {}
