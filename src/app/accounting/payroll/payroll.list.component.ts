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
import {Component, OnInit} from '@angular/core';
import * as fromAccouting from '../store/index';
import {AccountingStore} from '../store/index';
import {Observable} from 'rxjs/Observable';
import {TableData} from '../../common/data-table/data-table.component';
import {PayrollCollectionHistory} from '../../services/payroll/domain/payroll-collection-history.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {LOAD_ALL_COLLECTIONS} from '../store/payroll/payroll-collection.actions';

@Component({
  providers: [DatePipe],
  templateUrl: './payroll.list.component.html'
})
export class PayrollListComponent implements OnInit {

  payrollData$: Observable<TableData>;

  columns: any[] = [
    { name: 'createdBy', label: 'Created by' },
    { name: 'createdOn', label: 'Created on', format: value => this.datePipe.transform(value, 'short') },
    { name: 'sourceAccountNumber', label: 'Account number' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private datePipe: DatePipe,
              private store: AccountingStore) {
    this.payrollData$ = this.store.select(fromAccouting.getAllPayrollCollectionEntities)
      .map((collections: PayrollCollectionHistory[]) => ({
        data: collections,
        totalElements: collections.length,
        totalPages: 1
      }));
  }

  ngOnInit(): void {
    this.store.dispatch({
      type: LOAD_ALL_COLLECTIONS
    });
  }

  rowSelect(collection: PayrollCollectionHistory): void {
    this.router.navigate(['payments', collection.identifier], { relativeTo: this.route });
  }
}
