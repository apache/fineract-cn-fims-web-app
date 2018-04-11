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
import {ProductDefinition} from './domain/definition/product-definition.model';
import {ProductDefinitionCommand} from './domain/definition/product-definition-command.model';
import {ProductInstance} from './domain/instance/product-instance.model';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {Action} from './domain/definition/action.model';
import {DividendDistribution} from './domain/definition/dividend-distribution.model';
import {AvailableTransactionType} from './domain/instance/available-transaction-type.model';

@Injectable()
export class DepositAccountService {

  constructor(private http: HttpClient, @Inject('depositAccountBaseUrl') private baseUrl: string) {
  }

  createProductDefinition(productDefinition: ProductDefinition): Observable<void> {
    return this.http.post(`${this.baseUrl}/definitions`, productDefinition);
  }

  updateProductDefinition(productDefinition: ProductDefinition): Observable<void> {
    return this.http.put(`${this.baseUrl}/definitions/${productDefinition.identifier}`, productDefinition);
  }

  deleteProductDefinition(identifier: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/definitions/${identifier}`);
  }

  fetchProductDefinitions(): Observable<ProductDefinition[]> {
    return this.http.get(`${this.baseUrl}/definitions`);
  }

  findProductDefinition(identifier: string): Observable<ProductDefinition> {
    return this.http.get(`${this.baseUrl}/definitions/${identifier}`);
  }

  processCommand(identifier: string, command: ProductDefinitionCommand): Observable<void> {
    return this.http.post(`${this.baseUrl}/definitions/${identifier}/commands`, command);
  }

  fetchDividendDistributions(identifier: string): Observable<DividendDistribution[]> {
    return this.http.get(`${this.baseUrl}/definitions/${identifier}/dividends`);
  }

  distributeDividend(identifier: string, dividendDistribution: DividendDistribution): Observable<void> {
    return this.http.post(`${this.baseUrl}/definitions/${identifier}/dividends`, dividendDistribution);
  }

  createProductInstance(productInstance: ProductInstance): Observable<void> {
    return this.http.post(`${this.baseUrl}/instances`, productInstance);
  }

  updateProductInstance(productInstance: ProductInstance): Observable<void> {
    return this.http.put(`${this.baseUrl}/instances/${productInstance.accountIdentifier}`, productInstance);
  }

  findProductInstance(identifier: string): Observable<ProductInstance> {
    return this.http.get(`${this.baseUrl}/instances/${identifier}`);
  }

  fetchProductInstances(customerIdentifier: string, productIdentifier?: string): Observable<ProductInstance[]> {
    const search = new URLSearchParams();

    search.append('customer', customerIdentifier);
    search.append('product', productIdentifier);

    const requestOptions: RequestOptionsArgs = {
      search
    };

    return this.http.get(`${this.baseUrl}/instances`, requestOptions);
  }

  fetchActions(): Observable<Action[]> {
    return this.http.get(`${this.baseUrl}/actions`);
  }

  fetchPossibleTransactionTypes(customerIdentifier: string): Observable<AvailableTransactionType[]> {
    const search = new URLSearchParams();

    search.append('customer', customerIdentifier);

    const requestOptions: RequestOptionsArgs = {
      search
    };

    return this.http.get(`${this.baseUrl}/instances/transactiontypes`, requestOptions);
  }


}
