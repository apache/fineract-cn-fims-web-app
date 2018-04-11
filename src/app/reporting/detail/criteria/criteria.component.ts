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
import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {QueryParameter} from '../../../services/reporting/domain/query-parameter.model';
import {ReportingQueryParamsComponent} from '../queryParams/query-params.component';
import {DisplayableField} from '../../../services/reporting/domain/displayable-field.model';
import {ReportingDisplayableFieldsComponent} from '../displayableFields/displayable-fields.component';

export interface GenerateReportEvent {
  queryParameter: QueryParameter[];
  displayableFields: DisplayableField[];
}

@Component({
  selector: 'fims-reporting-criteria',
  templateUrl: './criteria.component.html'
})
export class ReportingCriteriaComponent {

  mandatoryParams: QueryParameter[];

  optionalParams: QueryParameter[];

  @ViewChild('mandatoryComponent') mandatoryComponent: ReportingQueryParamsComponent;

  @ViewChild('optionalComponent') optionalComponent: ReportingQueryParamsComponent;

  @ViewChild('displayableFieldComponent') displayableFieldsComponent: ReportingDisplayableFieldsComponent;

  @Input() set queryParameter(queryParameter: QueryParameter[]) {
    if (!queryParameter) {
      return;
    }

    this.mandatoryParams = queryParameter.filter(param => param.mandatory);
    this.optionalParams = queryParameter.filter(param => !param.mandatory);
  };

  @Input() displayableFields: DisplayableField[];

  @Output() onGenerateReport = new EventEmitter<GenerateReportEvent>();

  get valid(): boolean {
    return this.mandatoryComponent.valid && this.optionalComponent.valid;
  }

  generateReport(): void {
    const queryParameter: QueryParameter[] = [
      ...this.mandatoryComponent.formData,
      ...this.optionalComponent.formData
    ];

    const displayableFields: DisplayableField[] = this.displayableFieldsComponent.formData;

    this.onGenerateReport.emit({
      queryParameter,
      displayableFields
    });
  }

}
