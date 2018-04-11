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
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Ledger} from '../services/accounting/domain/ledger.model';
import {TableData} from '../common/data-table/data-table.component';
import * as fromAccounting from './store';
import {LOAD_ALL_TOP_LEVEL} from './store/ledger/ledger.actions';
import {Observable} from 'rxjs/Observable';
import {AccountingStore} from './store/index';

@Component({
  templateUrl: './general-ledger.component.html'
})
export class GeneralLedgerComponent implements OnInit {

  ledgerData: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id', tooltip: 'Id' },
    { name: 'name', label: 'Name', tooltip: 'Name' },
    { name: 'description', label: 'Description', tooltip: 'Description' },
    { name: 'totalValue', label: 'Balance', tooltip: 'Balance', format: value => value ? value.toFixed(2) : '-' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit(): void {
    this.ledgerData = this.store.select(fromAccounting.getAllTopLevelLedgerEntities)
      .map(ledgers => ({
        data: ledgers,
        totalElements: ledgers.length,
        totalPages: 1
      }));

    this.route.queryParams.subscribe((params: Params) => {
      this.store.dispatch({ type: LOAD_ALL_TOP_LEVEL });
    });
  }

  rowSelect(ledger: Ledger): void {
    this.router.navigate(['ledgers/detail', ledger.identifier, 'ledgers'], { relativeTo: this.route });
  }

}
