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
import {Component} from '@angular/core';
import * as fromPortfolio from '../store/index';
import {PortfolioStore} from '../store/index';
import {Observable} from 'rxjs/Observable';
import {TableData} from '../../../common/data-table/data-table.component';

@Component({
  templateUrl: './loss-provision.detail.component.html'
})
export class LossProvisionDetailComponent {

  stepData$: Observable<TableData>;

  columns: any[] = [
    { name: 'daysLate', label: 'Days late' },
    { name: 'percentProvision', label: 'Percent', format: v => `${v}%`}
  ];

  constructor(private store: PortfolioStore) {
    this.stepData$ = store.select(fromPortfolio.getProductLossProvisionConfiguration)
      .map(configuration => ({
        data: configuration.lossProvisionSteps,
        totalElements: configuration.lossProvisionSteps.length,
        totalPages: 1
      }));
  }

}
