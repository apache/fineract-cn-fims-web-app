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
import {RoleComponent} from './role.component';
import {RoleRoutes} from './role.routing';
import {CovalentCoreModule} from '@covalent/core';
import {RoleFormComponent} from './form/form.component';
import {CreateRoleFormComponent} from './form/create/create.form.component';
import {EditRoleFormComponent} from './form/edit/edit.form.component';
import {CommonModule} from '../../components/common.module';
import {RoleExistsGuard} from './role-exists.guard';
import {RolesStore, roleStoreFactory} from './store/index';
import {Store} from '@ngrx/store';
import {RoleNotificationEffects} from './store/effects/notification.effects';
import {EffectsModule} from '@ngrx/effects';
import {RoleRouteEffects} from './store/effects/route.effects';
import {RoleApiEffects} from './store/effects/service.effects';

@NgModule({
  imports: [
    RouterModule.forChild(RoleRoutes),
    CommonModule,
    ReactiveFormsModule,
    EffectsModule.run(RoleApiEffects),
    EffectsModule.run(RoleRouteEffects),
    EffectsModule.run(RoleNotificationEffects)
  ],
  declarations: [
    RoleComponent,
    RoleFormComponent,
    CreateRoleFormComponent,
    EditRoleFormComponent
  ],
  providers: [
    RoleExistsGuard,
    { provide: RolesStore, useFactory: roleStoreFactory, deps: [Store]}
  ],
  entryComponents: []
})
export class RoleModule {}
