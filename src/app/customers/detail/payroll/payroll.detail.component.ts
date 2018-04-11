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
import {PayrollConfiguration} from '../../../services/payroll/domain/payroll-configuration.model';
import {Observable} from 'rxjs/Observable';
import * as fromCustomers from '../../store/index';
import {CustomersStore} from '../../store/index';
import {TableData} from '../../../common/data-table/data-table.component';

@Component({
  templateUrl: './payroll.detail.component.html'
})
export class CustomerPayrollDetailComponent {

  distribution$: Observable<PayrollConfiguration>;

  allocationData: TableData;

  columns: any[] = [
    { name: 'accountNumber', label: 'Account Number' },
    { name: 'amount', label: 'Amount' },
    { name: 'proportional', label: 'Proportional?' }
  ];

  constructor(private store: CustomersStore) {
    this.distribution$ = store.select(fromCustomers.getPayrollDistribution)
      .filter(distribution => !!distribution)
      .do(distribution => this.allocationData = {
        data: distribution.payrollAllocations,
        totalElements: distribution.payrollAllocations.length,
        totalPages: 1
      });
  }
}
