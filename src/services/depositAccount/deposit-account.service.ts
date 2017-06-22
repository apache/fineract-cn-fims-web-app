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
import {Observable} from 'rxjs/Observable';
import {ProductDefinition} from './domain/definition/product-definition.model';
import {ProductDefinitionCommand} from './domain/definition/product-definition-command.model';
import {ProductInstance} from './domain/instance/product-instance.model';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {Action} from './domain/definition/action.model';

@Injectable()
export class DepositAccountService {

  constructor(private http: HttpClient, @Inject('depositAccountBaseUrl') private baseUrl: string) {}

  createProductDefinition(productDefinition: ProductDefinition): Observable<void> {
    return this.http.post(`${this.baseUrl}/definitions`, productDefinition)
  }

  updateProductDefinition(productDefinition: ProductDefinition): Observable<void> {
    return this.http.put(`${this.baseUrl}/definitions/${productDefinition.identifier}`, productDefinition)
  }

  deleteProductDefinition(identifier: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/definitions/${identifier}`)
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
    let params = new URLSearchParams();

    params.append('customer', customerIdentifier);
    params.append('product', productIdentifier);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.get(`${this.baseUrl}/instances`, requestOptions);
  }

  fetchActions(): Observable<Action[]> {
    return this.http.get(`${this.baseUrl}/actions`);
  }
}
