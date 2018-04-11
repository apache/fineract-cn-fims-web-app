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

import {CovalentChipsModule, CovalentDataTableModule, CovalentExpansionPanelModule, CovalentStepsModule} from '@covalent/core';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FimsSharedModule} from '../common/common.module';
import {NgModule, Type} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReportingRoutes} from './reporting.routes';
import {ReportingDefinitionsComponent} from './reporting-definitions.component';
import {ReportingDefinitionComponent} from './detail/reporting-definition.component';
import {ReportingQueryParamsComponent} from './detail/queryParams/query-params.component';
import {FimsQueryParamDirective, ReportingQueryParamComponent} from './detail/queryParams/query-param.component';
import {ReportingBetweenParamComponent} from './detail/queryParams/between/between.component';
import {ReportingInputParamComponent} from './detail/queryParams/input/input.component';
import {ReportingInParamComponent} from './detail/queryParams/in/in.component';
import {ReportingComponent} from './reporting.component';
import {ReportingReportPageComponent} from './detail/report-page/report-page.component';
import {ReportingDisplayableFieldsComponent} from './detail/displayableFields/displayable-fields.component';
import {ReportingCriteriaComponent} from './detail/criteria/criteria.component';

const QUERY_PARAM_COMPONENTS: Type<any>[] = [
  ReportingBetweenParamComponent,
  ReportingInputParamComponent,
  ReportingInParamComponent
];

@NgModule({
  imports: [
    RouterModule.forChild(ReportingRoutes),
    FimsSharedModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    CovalentStepsModule,
    CovalentDataTableModule,
    CovalentChipsModule,
    CovalentExpansionPanelModule
  ],
  declarations: [
    ReportingComponent,
    ReportingDefinitionsComponent,
    ReportingDefinitionComponent,
    ReportingCriteriaComponent,
    ReportingQueryParamsComponent,
    ReportingQueryParamComponent,
    ReportingReportPageComponent,
    ReportingDisplayableFieldsComponent,
    QUERY_PARAM_COMPONENTS,
    FimsQueryParamDirective
  ],
  entryComponents: [
    QUERY_PARAM_COMPONENTS
  ]
})
export class ReportingModule {}
