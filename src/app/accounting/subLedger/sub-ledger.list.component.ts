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
import {TableData} from '../../../common/data-table/data-table.component';
import {AccountingStore} from '../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromAccounting from '../store';
import {Observable} from 'rxjs/Observable';
import {DELETE} from '../store/ledger/ledger.actions';
import {TranslateService} from '@ngx-translate/core';
import {TdDialogService} from '@covalent/core';

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

  constructor(private route: ActivatedRoute, private router: Router, private store: AccountingStore, private translate: TranslateService, private dialogService: TdDialogService) {}

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

  confirmDeletion(): Observable<boolean>{
    let message = 'Do you want to delete this ledger?';
    let title = 'Confirm deletion';
    let button = 'DELETE LEDGER';

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  deleteLedger(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch({ type: DELETE, payload: {
          ledger: this.ledger,
          activatedRoute: this.route
        }})
      });
  }

}
