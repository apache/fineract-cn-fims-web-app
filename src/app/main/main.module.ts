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
import {MainComponent} from './main.component';
import {MainRoutes, mainRoutingProviders} from './main.routing';
import {AccessDeniedComponent} from './access.denied.component';
import {FimsSharedModule} from '../../common/common.module';
import {NotificationComponent} from './notification.component';
import {QuickAccessComponent} from '../quickAccess/quick-access.component';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdSidenavModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    RouterModule.forChild(MainRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    MdButtonModule,
    MdToolbarModule,
    MdSidenavModule,
    MdListModule,
    MdProgressBarModule,
    MdIconModule,
    MdMenuModule,
    MdTooltipModule,
    MdCardModule
  ],
  declarations: [
    MainComponent,
    QuickAccessComponent,
    AccessDeniedComponent,
    NotificationComponent
  ],
  providers: [
    mainRoutingProviders
  ],
})
export class MainModule {}
