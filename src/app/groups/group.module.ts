/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { RouterModule } from '@angular/router';
import { GroupRoutes } from './group.routing';
import { NgModule } from '@angular/core';
import { GroupComponent } from './group.component';
import { GroupFormComponent } from './form/form.component';
import { CreateGroupFormComponent } from './form/create/create.form.component';
import { FimsSharedModule } from '../common/common.module';
import { SignOffMeetingComponent } from './detail/signOffMeeting/signOff-meeting.component';
import { GroupDetailFormComponent } from './form/detail/detail.component';
import { GroupOfficesComponent } from './form/offices/offices.component';
import { GroupEmployeesComponent } from './form/employees/employees.component';
import { GroupCustomersComponent } from './form/customers/customers.component'
import { EditGroupFormComponent } from './form/edit/edit.form.component';
import { GroupExistsGuard } from './group-exists.guard';
import { GroupsStore, groupStoreFactory } from './store/index';
import { Store } from '@ngrx/store';
import { GroupDetailComponent } from './detail/group.detail.component'
import { GroupIndexComponent } from './detail/group.index.component'
import { GroupCommandApiEffects } from './store/groupTasks/effects/service.effects';
import { CommandApiEffects } from './store/commands/effects/service.effects';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupNotificationEffects } from './store/effects/notification.effects';
import { GroupRouteEffects } from './store/effects/route.effects';
import { EffectsModule } from '@ngrx/effects';
import { GroupApiEffects } from './store/effects/service.effects';
import { GroupDefinitionApiEffects } from './store/definition/effects/service.effects'
import { GroupDefinitionRouteEffects } from './store/definition/effects/route.effects'
import { GroupDefinitionNotificationEffects } from './store/definition/effects/notification.effects'
import { MeetingApiEffects } from './store/meeting/effects/service.effects'
import { MeetingRouteEffects } from './store/meeting/effects/route.effects'
import { MeetingNotificationEffects } from './store/meeting/effects/notification.effects'
import { GroupCommandNotificationEffects } from './store/groupTasks/effects/notification.effects'
import { GroupCommandRouteEffects } from './store/groupTasks/effects/route.effects'


import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatToolbarModule,
  MatAutocompleteModule
} from '@angular/material';
import { CovalentChipsModule, CovalentFileModule, CovalentMessageModule, CovalentSearchModule, CovalentStepsModule } from '@covalent/core';
import { GroupDefinitionIndexComponent } from './definition/definition.index.component';
import { GroupDefinitionListComponent } from './definition/definition.list.component'
import { GroupDefinitionExistsGuard } from './definition/definition-exits.guard';
import { GroupDefinitionDetailComponent } from './definition/definition.detail.component'
import { EditGroupDefinitionFormComponent } from './definition/form/edit.form.component';
import { GroupDefinitionFormComponent } from './definition/form/form.component';
import { CreateGroupDefinitionFormComponent } from './definition/form/create.form.component';
import { GroupStatusComponent } from './detail/status/status.component'
import { GroupActivityComponent } from './detail/activity/activity.component'
import { MeetingComponent } from './detail/meeting/meeting.component'
import { MeetingDetailComponent } from './detail/meeting/meeting.detail.component'
import { MeetingIndexComponent } from './detail/meeting/meeting.index.component'


@NgModule({
  imports: [
    RouterModule.forChild(GroupRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatSelectModule,
    CovalentSearchModule,
    CovalentStepsModule,
    CovalentFileModule,
    CovalentMessageModule,
    CovalentChipsModule,

    EffectsModule.run(GroupApiEffects),
    EffectsModule.run(GroupRouteEffects),
    EffectsModule.run(GroupNotificationEffects),
    EffectsModule.run(GroupCommandApiEffects),
    EffectsModule.run(GroupCommandRouteEffects),
    EffectsModule.run(GroupCommandNotificationEffects),
    EffectsModule.run(CommandApiEffects),

    EffectsModule.run(GroupDefinitionApiEffects),
    EffectsModule.run(GroupDefinitionRouteEffects),
    EffectsModule.run(GroupDefinitionNotificationEffects),

    EffectsModule.run(MeetingApiEffects),
    EffectsModule.run(MeetingRouteEffects),
    EffectsModule.run(MeetingNotificationEffects),

  ],
  declarations: [
    GroupComponent,
    GroupDetailFormComponent,
    GroupOfficesComponent,
    GroupEmployeesComponent,
    GroupCustomersComponent,
    GroupFormComponent,
    CreateGroupFormComponent,
    EditGroupFormComponent,
    GroupDetailComponent,
    GroupIndexComponent,
    SignOffMeetingComponent,
    MeetingComponent,
    MeetingDetailComponent,
    MeetingIndexComponent,

    GroupDefinitionIndexComponent,
    GroupDefinitionDetailComponent,
    GroupDefinitionListComponent,
    EditGroupDefinitionFormComponent,
    CreateGroupDefinitionFormComponent,
    GroupDefinitionFormComponent,
    GroupStatusComponent,
    GroupActivityComponent,






  ],
  providers: [
    GroupExistsGuard,
    GroupDefinitionExistsGuard,

    { provide: GroupsStore, useFactory: groupStoreFactory, deps: [Store] }
  ]
})
export class GroupModule { }
