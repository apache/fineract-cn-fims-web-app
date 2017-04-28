/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Ledger} from '../../../services/accounting/domain/ledger.model';
import {TableData} from '../../../components/data-table/data-table.component';
import {AccountingStore} from '../store/index';
import {Router} from '@angular/router';
import * as fromAccounting from '../store';

@Component({
  templateUrl: './sub-ledger.list.component.html'
})
export class SubLedgerListComponent implements OnInit, OnDestroy{

  private selectionSubscription: Subscription;

  private _ledger: Ledger;

  ledgerData: TableData = {
    totalElements: 0,
    totalPages: 1,
    data: []
  };

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' }
  ];

  constructor(private router: Router, private store: AccountingStore) {}

  ngOnInit(): void {
    this.selectionSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .subscribe(ledger => this.ledger = ledger);
  }

  ngOnDestroy(): void {
    this.selectionSubscription.unsubscribe();
  }

  rowSelect(ledger: Ledger): void {
    this.router.navigate(['/accounting/ledgers/detail', ledger.identifier]);
  }

  set ledger(ledger: Ledger) {
    this._ledger = ledger;

    if(ledger.subLedgers) {
      this.ledgerData.data = ledger.subLedgers;
      this.ledgerData.totalElements = ledger.subLedgers.length;
    }
  }

  get ledger(): Ledger {
    return this._ledger;
  }

}
