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
import {OnInit, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Ledger} from '../../services/accounting/domain/ledger.model';
import {TableData} from '../../components/data-table/data-table.component';
import {Observable, Subscription} from 'rxjs';
import {TdDialogService} from '@covalent/core';
import {TranslateService} from '@ngx-translate/core';
import * as fromAccounting from './store';
import {SelectAction, DELETE} from './store/ledger/ledger.actions';
import {AccountingStore} from './store/index';

@Component({
  templateUrl: './sub-ledger.detail.component.html'
})
export class SubLedgerDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private ledgerSubscription: Subscription;

  private _ledger: Ledger;

  ledgerData: TableData = {
    totalElements: 0,
    totalPages: 1,
    data: []
  };

  columns: any[] = [
    { name: 'identifier', label: 'Id', tooltip: 'Id' },
    { name: 'name', label: 'Name', tooltip: 'Name' },
    { name: 'description', label: 'Description', tooltip: 'Description' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private dialogService: TdDialogService, private translate: TranslateService, private store: AccountingStore){}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.ledgerSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .subscribe(ledger => this.ledger = ledger);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.ledgerSubscription.unsubscribe();
  }

  rowSelect(ledger: Ledger): void{
    this.router.navigate(['../../', ledger.identifier], { relativeTo: this.route });
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

  set ledger(ledger: Ledger){
    this._ledger = ledger;
    this.ledgerData.data = ledger.subLedgers;
    this.ledgerData.totalElements = ledger.subLedgers.length;
  }

  get ledger(): Ledger{
    return this._ledger;
  }
}
