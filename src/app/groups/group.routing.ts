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
import { GroupComponent } from './group.component';
import { CreateGroupFormComponent } from './form/create/create.form.component';
import { EditGroupFormComponent } from './form/edit/edit.form.component';
import { GroupExistsGuard } from './group-exists.guard';
import { GroupDetailComponent } from './detail/group.detail.component';
import { GroupIndexComponent } from './detail/group.index.component';
import { SignOffMeetingComponent } from './detail/signOffMeeting/signOff-meeting.component';
import { GroupDefinitionIndexComponent } from './definition/definition.index.component';
import { GroupDefinitionListComponent } from './definition/definition.list.component'
import { EditGroupDefinitionFormComponent } from './definition/form/edit.form.component';
import { CreateGroupDefinitionFormComponent } from './definition/form/create.form.component';
import { GroupDefinitionExistsGuard } from './definition/definition-exits.guard';
import { GroupDefinitionDetailComponent } from './definition/definition.detail.component'
import { GroupStatusComponent } from './detail/status/status.component'
import { GroupActivityComponent } from './detail/activity/activity.component'
import { MeetingComponent } from './detail/meeting/meeting.component'
import { MeetingDetailComponent } from './detail/meeting/meeting.detail.component'
import { MeetingIndexComponent } from './detail/meeting/meeting.index.component'

export const GroupRoutes: Routes = [
  {
    path: '',
    component: GroupComponent,
    data: { title: 'Manage Groups', hasPermission: { id: 'group_groups', accessLevel: 'READ' } },
  },

  {
    path: 'create',
    component: CreateGroupFormComponent,
    data: { title: 'Create Group', hasPermission: { id: 'group_groups', accessLevel: 'CHANGE' } }
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
        data: { title: 'View Groups' }
      },

      {
        path: 'activities',
        component: GroupActivityComponent,
        data: { title: 'Manage groups' }
      },
      {
        path: 'status',
        component: GroupStatusComponent,
        data: { title: 'Active Group', hasPermission: { id: 'group_groups', accessLevel: 'READ' } }
      },
      {
        path: 'meeting',
        component: MeetingComponent,
        data: { title: 'Meeting details', hasPermission: { id: 'group_groups', accessLevel: 'READ' } }
      },

      {
        path: 'meeting/detail/:id',
        component: MeetingIndexComponent,
        data: {
          hasPermission: { id: 'group_groups', accessLevel: 'READ' }
        },
        children: [
          {
            path: '',
            component: MeetingDetailComponent
          },
        ]
      },

      {
        path: 'signOff',
        component: SignOffMeetingComponent,
        data: { title: 'signOff-meeting', hasPermission: { id: 'group_groups', accessLevel: 'CHANGE' } }
      },
    ]
  },

  {
    path: 'definition',
    component: GroupDefinitionListComponent,
    data: {
      hasPermission: { id: 'group_definition', accessLevel: 'READ' }
    }
  },

  {
    path: 'definition/detail/:id/edit',
    component: EditGroupDefinitionFormComponent,
    data: { title: 'Edit GroupDefinition', hasPermission: { id: 'group_definition', accessLevel: 'CHANGE' } },
    canActivate: [GroupDefinitionExistsGuard]
  },
  {
    path: 'definition/detail/:id',
    canActivate: [GroupDefinitionExistsGuard],
    component: GroupDefinitionIndexComponent,
    data: {
      hasPermission: { id: 'group_definition', accessLevel: 'READ' }
    },
    children: [
      {
        path: '',
        component: GroupDefinitionDetailComponent
      },
    ]
  },

  {
    path: 'definition/create',
    component: CreateGroupDefinitionFormComponent,
    data: {
      hasPermission: { id: 'group_definition', accessLevel: 'CHANGE' }
    }
  },

]
