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
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '../http/http.service';
import {Observable} from 'rxjs/Observable';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {Cheque} from './domain/cheque.model';
import {IssuingCount} from './domain/issuing-count.model';
import {ChequeProcessingCommand} from './domain/cheque-processing-command';
import {ChequeTransaction} from './domain/cheque-transaction';
import {MICRResolution} from './domain/micr-resolution.model';
import {FimsCheque} from './domain/fims-cheque.model';
import {mapToFimsCheque, mapToFimsCheques} from './domain/mapper/fims-cheque.mapper';

@Injectable()
export class ChequeService {

  constructor(private http: HttpClient, @Inject('chequeBaseUrl') private baseUrl: string) {
  }

  public issue(issuingCount: IssuingCount): Observable<string> {
    return this.http.post(`${this.baseUrl}/cheques/`, issuingCount);
  }

  public fetch(state?: string, accountIdentifier?: string): Observable<FimsCheque[]> {
    const search = new URLSearchParams();

    search.append('state', state);
    search.append('accountIdentifier', accountIdentifier);

    const requestOptions: RequestOptionsArgs = {
      search
    };

    return this.http.get(`${this.baseUrl}/cheques/`, requestOptions)
      .map((cheques: Cheque[]) => mapToFimsCheques(cheques));
  }

  public get(identifier: string): Observable<FimsCheque> {
    return this.http.get(`${this.baseUrl}/cheques/${identifier}`)
      .map((cheque: Cheque) => mapToFimsCheque(cheque));
  }

  public process(identifier: string, command: ChequeProcessingCommand): Observable<void> {
    return this.http.post(`${this.baseUrl}/cheques/${identifier}/commands`, command);
  }

  public processTransaction(transaction: ChequeTransaction): Observable<void> {
    return this.http.post(`${this.baseUrl}/transactions/`, transaction);
  }

  public expandMicr(identifier: string): Observable<MICRResolution> {
    return this.http.get(`${this.baseUrl}/micr/${identifier}`, {}, true);
  }

}
