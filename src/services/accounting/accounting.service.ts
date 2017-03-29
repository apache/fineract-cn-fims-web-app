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

import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '../http/http.service';
import {Ledger} from './domain/ledger.model';
import {Observable} from 'rxjs';
import {Account} from './domain/account.model';
import {AccountEntry} from './domain/account-entry.model';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {AccountCommand} from './domain/account-command.model';
import {JournalEntry} from './domain/journal-entry.model';
import {TrialBalance} from './domain/trial-balance.model';
import {AccountEntryPage} from './domain/account-entry-page.model';
import {AccountPage} from './domain/account-page.model';
import {FetchRequest} from '../domain/paging/fetch-request.model';
import {buildSearchParams, buildDateRangeParam} from '../domain/paging/search-param.builder';

@Injectable()
export class AccountingService{

  constructor(private http: HttpClient, @Inject('accountingBaseUrl') private baseUrl: string) {}

  public createLedger(ledger: Ledger): Observable<void>{
    return this.http.post(`${this.baseUrl}/ledgers`, ledger);
  }

  public fetchLedgers(): Observable<Ledger[]>{
    return this.http.get(`${this.baseUrl}/ledgers`);
  }

  public fetchSubLedgers(identifier: string): Observable<Ledger[]>{
    // TODO implement in accounting
    return this.http.get(`${this.baseUrl}/ledgers`);
  }

  public findLedger(identifier: string): Observable<Ledger>{
    return this.http.get(`${this.baseUrl}/ledgers/${identifier}`);
  }

  public addSubLedger(identifier: string, subLedger: Ledger): Observable<void>{
    return this.http.post(`${this.baseUrl}/ledgers/${identifier}`, subLedger);
  }

  public modifyLedger(ledger: Ledger): Observable<void>{
    return this.http.put(`${this.baseUrl}/ledgers/${ledger.identifier}`, ledger);
  }

  public deleteLedger(identifier: string): Observable<void>{
    return this.http.delete(`${this.baseUrl}/ledgers/${identifier}`);
  }

  public fetchAccountsOfLedger(identifier: string, fetchRequest?: FetchRequest): Observable<AccountPage>{
    let params: URLSearchParams = buildSearchParams(fetchRequest);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/ledgers/${identifier}/accounts`, requestOptions);
  }

  public createAccount(account: Account): Observable<void>{
    return this.http.post(`${this.baseUrl}/accounts`, account);
  }

  public fetchAccounts(fetchRequest?: FetchRequest): Observable<AccountPage>{
    let params: URLSearchParams = buildSearchParams(fetchRequest);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/accounts`, requestOptions)
      .share();
  }

  public findAccount(identifier: string, silent?: boolean): Observable<Account>{
    return this.http.get(`${this.baseUrl}/accounts/${identifier}`, {}, silent);
  }

  public modifyAccount(account: Account): Observable<void>{
    return this.http.put(`${this.baseUrl}/accounts/${account.identifier}`, account);
  }

  public fetchAccountEntries(identifier: string, startDate: string, endDate: string, fetchRequest?: FetchRequest): Observable<AccountEntryPage>{
    let params: URLSearchParams = buildSearchParams(fetchRequest);
    let dateRange = buildDateRangeParam(startDate, endDate);
    params.append('dateRange', dateRange);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/accounts/${identifier}/entries`, requestOptions);
  }

  public fetchAccountCommands(identifier: string): Observable<AccountCommand[]>{
    return this.http.get(`${this.baseUrl}/accounts/${identifier}/commands`);
  }

  public accountCommand(identifier: string, command: AccountCommand): Observable<void>{
    return this.http.post(`${this.baseUrl}/accounts/${identifier}/commands`, command);
  }

  public createJournalEntry(journalEntry: JournalEntry): Observable<void>{
    return this.http.post(`${this.baseUrl}/journal`, journalEntry);
  }

  public fetchJournalEntries(startDate: string, endDate: string): Observable<JournalEntry[]>{
    let params: URLSearchParams = new URLSearchParams();
    params.append('dateRange', buildDateRangeParam(startDate, endDate));

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/journal`, requestOptions)
  }

  public findJournalEntry(transactionIdentifier: string): Observable<JournalEntry>{
    return this.http.get(`${this.baseUrl}/journal/${transactionIdentifier}`)
  }

  public getTrialBalance(includeEmptyEntries?: boolean): Observable<TrialBalance>{
    let params: URLSearchParams = new URLSearchParams();
    params.append('includeEmptyEntries', includeEmptyEntries ? 'true' : 'false');

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/trialbalance`, requestOptions)
  }
}
