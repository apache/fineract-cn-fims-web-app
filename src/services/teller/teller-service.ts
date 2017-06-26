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

import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '../http/http.service';
import {Teller} from './domain/teller.model';
import {Observable} from 'rxjs/Observable';
import {TellerManagementCommand} from './domain/teller-management-command.model';
import {TellerBalanceSheet} from './domain/teller-balance-sheet.model';
import {TellerAuthentication} from './domain/teller-authentication.model';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {TellerTransactionCosts} from './domain/teller-transaction-costs.model';
import {TellerTransaction} from './domain/teller-transaction.model';

@Injectable()
export class TellerService {

  constructor(private http: HttpClient, @Inject('tellerBaseUrl') private baseUrl: string) {}

  create(officeIdentifier: string, teller: Teller): Observable<void> {
    return this.http.post(`${this.baseUrl}/offices/${officeIdentifier}/teller`, teller);
  }

  find(officeIdentifier: string, tellerCode: string): Observable<Teller> {
    return this.http.get(`${this.baseUrl}/offices/${officeIdentifier}/teller/${tellerCode}`);
  }

  fetch(officeIdentifier: string): Observable<Teller[]> {
    return this.http.get(`${this.baseUrl}/offices/${officeIdentifier}/teller`);
  }

  change(officeIdentifier: string, teller: Teller): Observable<void> {
    return this.http.put(`${this.baseUrl}/offices/${officeIdentifier}/teller/${teller.code}`, teller);
  }

  createCommand(officeIdentifier: string, tellerCode: string, tellerManagementCommand: TellerManagementCommand): Observable<void> {
    return this.http.post(`${this.baseUrl}/offices/${officeIdentifier}/teller/${tellerCode}/commands`, tellerManagementCommand);
  }

  getBalance(officeIdentifier: string, tellerCode: string): Observable<TellerBalanceSheet> {
    return this.http.get(`${this.baseUrl}/offices/${officeIdentifier}/teller/${tellerCode}/balance`);
  }

  unlockDrawer(tellerCode: string, tellerAuthentication: TellerAuthentication): Observable<Teller> {
    return this.http.post(`${this.baseUrl}/teller/${tellerCode}/drawer`, tellerAuthentication, undefined, true);
  }

  executeCommand(tellerCode: string, command: string): Observable<void> {
    const params = new URLSearchParams();
    params.append('command', command);

    const requestOptions: RequestOptionsArgs = {
      params
    };

    return this.http.post(`${this.baseUrl}/teller/${tellerCode}`, {}, requestOptions);
  }

  createTransaction(tellerCode: string, tellerTransaction: TellerTransaction): Observable<TellerTransactionCosts> {
    return this.http.post(`${this.baseUrl}/teller/${tellerCode}/transactions`, tellerTransaction);
  }

  confirmTransaction(tellerCode: string, tellerTransactionIdentifier: string, command: string): Observable<void> {
    const params = new URLSearchParams();
    params.append('command', command);

    const requestOptions: RequestOptionsArgs = {
      params
    };

    return this.http.post(`${this.baseUrl}/teller/${tellerCode}/transactions/${tellerTransactionIdentifier}`, {}, requestOptions);
  }

  getTransactions(tellerCode: string): Observable<TellerTransaction[]> {
    return this.http.get(`${this.baseUrl}/teller/${tellerCode}/transactions`);
  }

}
