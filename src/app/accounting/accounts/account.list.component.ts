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
import {TableData, TableFetchRequest} from '../../../components/data-table/data-table.component';
import {Router} from '@angular/router';
import {Account} from '../../../services/accounting/domain/account.model';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Ledger} from '../../../services/accounting/domain/ledger.model';
import * as fromRoot from '../../reducers';
import * as fromAccounting from '../store';
import {Subscription, Observable} from 'rxjs';
import {SEARCH_BY_LEDGER} from '../../reducers/account/account.actions';
import {AccountingStore} from '../store/index';

interface TableDataWrapper{
  identifier: string;
}

@Component({
  templateUrl: './account.list.component.html'
})
export class AccountListComponent implements OnInit, OnDestroy{

  private selectionSubscription: Subscription;

  private ledger: Ledger;

  private lastFetchRequest: FetchRequest = {};

  private accountData$: Observable<TableData>;

  private columns: any[] = [
    { name: 'identifier', label: 'Id', tooltip: 'Id' },
    { name: 'state', label: 'State', tooltip: 'State' },
    { name: 'balance', label: 'Balance', tooltip: 'Balance' }
  ];

  constructor(private router: Router, private store: AccountingStore) {}

  ngOnInit(): void {
    this.selectionSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .subscribe(ledger => {
        this.ledger = ledger;
        this.fetchAccounts();
      });

    this.accountData$ = this.store.select(fromRoot.getAccountSearchResults)
      .map(accountPage => ({
        data: accountPage.accounts,
        totalElements: accountPage.totalElements,
        totalPages: accountPage.totalPages
      }))
  }

  ngOnDestroy(): void {
    this.selectionSubscription.unsubscribe();
  }

  private rowSelect(account: Account): void{
    this.router.navigate(['/accounting/accounts/detail', account.identifier]);
  }

  private fetchAccounts(fetchRequest?: TableFetchRequest): void{
    if(fetchRequest){
      this.lastFetchRequest = fetchRequest;
    }

    this.store.dispatch({ type: SEARCH_BY_LEDGER, payload: {
      ledgerId: this.ledger.identifier,
      fetchRequest: this.lastFetchRequest
    } });

  }

}
