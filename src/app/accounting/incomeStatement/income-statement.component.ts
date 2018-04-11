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
import {IncomeStatement} from '../../services/accounting/domain/income-statement.model';
import {Observable} from 'rxjs/Observable';
import {IncomeStatementSection} from '../../services/accounting/domain/income-statement-section.model';

@Component({
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.scss']
})
export class IncomeStatementComponent {

  incomeStatement$: Observable<IncomeStatement>;

  income$: Observable<IncomeStatementSection>;

  expenses$: Observable<IncomeStatementSection>;

  constructor(private accountingService: AccountingService) {
    this.incomeStatement$ = accountingService.getIncomeStatement().share();

    this.income$ = this.incomeStatement$
      .map(statement => statement.incomeStatementSections
        .find(section => section.type === 'INCOME')
      );

    this.expenses$ = this.incomeStatement$
      .map(statement => statement.incomeStatementSections
        .find(section => section.type === 'EXPENSES')
      );
  }
}
