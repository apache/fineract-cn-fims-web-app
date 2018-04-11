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

import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReportDefinition} from '../../services/reporting/domain/report-definition.model';
import {ActivatedRoute} from '@angular/router';
import {ReportingService} from '../../services/reporting/reporting.service';
import {ReportRequest} from '../../services/reporting/domain/report-request.model';
import {QueryParameter} from '../../services/reporting/domain/query-parameter.model';
import {ReportPage} from '../../services/reporting/domain/report-page.model';
import {DisplayableField} from '../../services/reporting/domain/displayable-field.model';
import {GenerateReportEvent, ReportingCriteriaComponent} from './criteria/criteria.component';

@Component({
  templateUrl: './reporting-definition.component.html'
})
export class ReportingDefinitionComponent implements OnInit {

  private category: string;

  private identifier: string;

  @ViewChild('criteria') criteriaComponent: ReportingCriteriaComponent;

  queryParameter$: Observable<QueryParameter[]>;

  displayableFields$: Observable<DisplayableField[]>;

  reportPage$: Observable<ReportPage>;

  constructor(private route: ActivatedRoute, private reportingService: ReportingService) {}

  ngOnInit(): void {
    const reportDefinition$: Observable<ReportDefinition> = this.route.params
      .do(params => {
        this.category = params['category'];
        this.identifier = params['identifier'];
      })
      .switchMap(params => this.reportingService.findReportDefinition(params['category'], params['identifier']));

    this.queryParameter$ = reportDefinition$
      .map(reportDefinition => reportDefinition.queryParameters);

    this.displayableFields$ = reportDefinition$
      .map(reportDefinition => reportDefinition.displayableFields);
  }

  generateReport(event: GenerateReportEvent): void {
    const reportRequest: ReportRequest = {
      displayableFields: event.displayableFields,
      queryParameters: event.queryParameter
    };

    this.reportPage$ = this.reportingService.generateReport(this.category, this.identifier, reportRequest);
  }
}
