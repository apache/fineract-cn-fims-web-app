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
import {Component, Input} from '@angular/core';
import {QueryParameter} from '../../../services/reporting/domain/query-parameter.model';
import {FormControl, FormGroup} from '@angular/forms';
import {FormComponent} from '../../../common/forms/form.component';

@Component({
  selector: 'fims-reporting-query-params',
  templateUrl: './query-params.component.html'
})
export class ReportingQueryParamsComponent extends FormComponent<QueryParameter[]> {

  private _queryParams: QueryParameter[];

  @Input() set queryParams(queryParams: QueryParameter[]) {
    if (!queryParams) {
      return;
    }

    this._queryParams = queryParams;

    queryParams.forEach(queryParam => this.addFormControl(this.form, queryParam));
  };

  private addFormControl(form: FormGroup, queryParam: QueryParameter): void {
    form.addControl(queryParam.name, new FormControl(''));
  }

  get formData(): QueryParameter[] {
    return this.queryParams.map(queryParam => Object.assign({}, queryParam, {
        value: this.form.get(queryParam.name).value
      })
    );
  }

  get queryParams(): QueryParameter[] {
    return this._queryParams;
  }
}
