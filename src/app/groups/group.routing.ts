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
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GroupComponent } from './group.component';
import { GroupFormComponent } from './form/form.component';
import { CreateGroupFormComponent } from './form/create/create.form.component';
import { FimsSharedModule } from '../common/common.module';
import { GroupDetailFormComponent } from './form/detail/detail.component';
import { GroupOfficesComponent } from './form/offices/offices.component';
import { GroupEmployeesComponent } from './form/employees/employees.component';
import { GroupCustomersComponent } from './form/customers/customers.component'
import { EditGroupFormComponent } from './form/edit/edit.form.component';
import { MeetingDateComponent } from './detail/meetingDate/meeting-date.component'
import { GroupExistsGuard } from './group-exists.guard';
import { GroupsStore, groupStoreFactory } from './store/index';
import { Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GroupCommandApiEffects } from './store/commands/effects/service.effects';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CloseGroupComponent } from './detail/closeGroup/close-group.component';
import { GroupDetailComponent } from './detail/group.detail.component';
import { GroupIndexComponent } from './detail/group.index.component';
import {MeetingDetailComponent} from './detail/meetingDetail/meeting-detail.component';
import {ManageMemberComponent} from './detail/manageMember/manage-member.component';
import {TransferMemberComponent} from './detail/transferMember/transfer-member.component';
import {DefinitionIndexComponent} from './definition/definition.index.component';
import {GroupDefinitionListComponent} from './definition/definition.list.component'


export const GroupRoutes: Routes = [
  {
    path: '',
    component: GroupComponent,
    data: { title: 'Manage Groups',hasPermission: {id: 'group_groups', accessLevel: 'READ'} },
    //canActivate: [ CatalogExistsGuard ]
  },
  {
    path: 'create',
    component: CreateGroupFormComponent,
    data: { title: 'Create Group',hasPermission: { id: 'group_groupss', accessLevel: 'CHANGE' } }
  },
  {
    path: 'detail/:id/edit',
    component: EditGroupFormComponent,
    data: { title: 'Edit Group', hasPermission: { id: 'group_groups', accessLevel: 'CHANGE' } },
    canActivate: [GroupExistsGuard]
  },
  {
    path: 'detail/:id',
    component: GroupIndexComponent,
    data: {
      hasPermission: { id: 'group_groups', accessLevel: 'READ' }
    },
    canActivate: [GroupExistsGuard],
    children: [
     
      {
        path: '',
        component: GroupDetailComponent,
        data: {title: 'View Groups'}
      },
    
      {
        path: 'transferMember',
        component: TransferMemberComponent,
        data: { title: 'Transfer Members', }
      },

    ]
  }
  ,
  {
    path: 'definition',
    component: GroupDefinitionListComponent,
    data: {
      hasPermission: { id: 'group_definition', accessLevel: 'READ' }
    }
  },

 /* {
    path: 'meetingDate',
    component: MeetingDateComponent,
    data: { title: 'meeting date Group', }
  },
  {
    path: 'close',
    component: CloseGroupComponent,
    data: { title: 'Closing a Group' }
  },
  {
    path: 'meetingDetail',
    component: MeetingDetailComponent,
    data: { title: 'meeting details', }
  },
  */
  
]