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
import {Ledger} from '../../../services/accounting/domain/ledger.model';
import {TableData, TableFetchRequest} from '../../../common/data-table/data-table.component';
import {Observable, Subscription} from 'rxjs';
import {TdDialogService} from '@covalent/core';
import {TranslateService} from '@ngx-translate/core';
import * as fromAccounting from '../store';
import * as fromRoot from '../../reducers';
import {SelectAction, DELETE} from '../store/ledger/ledger.actions';
import {AccountingStore} from '../store/index';
import {SEARCH_BY_LEDGER} from '../../reducers/account/account.actions';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Account} from '../../../services/accounting/domain/account.model';

@Component({
  templateUrl: './sub-ledger.detail.component.html'
})
export class SubLedgerDetailComponent implements OnInit, OnDestroy{

  private ledgerSubscription: Subscription;

  private lastFetchRequest: FetchRequest = {};

  ledger: Ledger;

  accountData$: Observable<TableData>;

  loading$: Observable<boolean>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'state', label: 'State' },
    { name: 'balance', label: 'Balance' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private dialogService: TdDialogService, private translate: TranslateService, private store: AccountingStore){}

  ngOnInit(): void {
    this.ledgerSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .filter(ledger => !!ledger)
      .subscribe(ledger => {
        this.ledger = ledger;
        this.fetchAccounts();
      });

    this.accountData$ = this.store.select(fromRoot.getAccountSearchResults)
      .map(accountPage => ({
        data: accountPage.accounts,
        totalElements: accountPage.totalElements,
        totalPages: accountPage.totalPages
      }));

    this.loading$ = this.store.select(fromRoot.getAccountSearchLoading);
  }

  ngOnDestroy(): void {
    this.ledgerSubscription.unsubscribe();
  }

  rowSelect(account: Account): void{
    this.router.navigate(['../../../../accounts/detail', account.identifier], { relativeTo: this.route });
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

  fetchAccounts(fetchRequest?: TableFetchRequest): void{
    if(fetchRequest){
      this.lastFetchRequest = fetchRequest;
    }

    this.store.dispatch({ type: SEARCH_BY_LEDGER, payload: {
      ledgerId: this.ledger.identifier,
      fetchRequest: this.lastFetchRequest
    } });

  }

}
