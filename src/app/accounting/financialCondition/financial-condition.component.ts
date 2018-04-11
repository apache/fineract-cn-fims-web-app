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
import {AccountingService} from '../../services/accounting/accounting.service';
import {FinancialCondition} from '../../services/accounting/domain/financial-condition.model';
import {Observable} from 'rxjs/Observable';
import {FinancialConditionSection} from '../../services/accounting/domain/financial-condition-section.model';

@Component({
  templateUrl: './financial-condition.component.html',
  styleUrls: ['./financial-condition.component.scss']
})
export class FinancialConditionComponent {

  financialCondition$: Observable<FinancialCondition>;

  assets$: Observable<FinancialConditionSection>;

  equities$: Observable<FinancialConditionSection>;

  liabilities$: Observable<FinancialConditionSection>;

  constructor(private accountingService: AccountingService) {
    this.financialCondition$ = accountingService.getFinancialCondition().share();

    this.assets$ = this.financialCondition$
      .map(statement => statement.financialConditionSections
        .find(section => section.type === 'ASSET')
      );

    this.equities$ = this.financialCondition$
      .map(statement => statement.financialConditionSections
        .find(section => section.type === 'EQUITY')
      );

    this.liabilities$ = this.financialCondition$
      .map(statement => statement.financialConditionSections
        .find(section => section.type === 'LIABILITY')
      );
  }
}
