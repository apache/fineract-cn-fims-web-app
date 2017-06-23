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
import {Observable} from 'rxjs';
import {Product} from './domain/product.model';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {TaskDefinition} from './domain/task-definition.model';
import {ChargeDefinition} from './domain/charge-definition.model';
import {Case} from './domain/case.model';
import {FetchRequest} from '../domain/paging/fetch-request.model';
import {buildSearchParams} from '../domain/paging/search-param.builder';
import {CaseCommand} from './domain/case-command.model';
import {TaskInstance} from './domain/task-instance.model';
import {PlannedPaymentPage} from './domain/individuallending/planned-payment-page.model';
import {CasePage} from './domain/case-page.model';
import {AccountAssignment} from './domain/account-assignment.model';
import {WorkflowAction} from './domain/individuallending/workflow-action.model';
import {ProductPage} from './domain/product-page.model';

@Injectable()
export class PortfolioService {

  constructor(private http: HttpClient, @Inject('portfolioBaseUrl') private baseUrl: string) {}

  findAllPatterns(): Observable<void>{
    return this.http.get(`${this.baseUrl}/patterns/`)
  }

  findAllProducts(includeDisabled?: boolean, fetchRequest?: FetchRequest): Observable<ProductPage> {
    const params: URLSearchParams = buildSearchParams(fetchRequest);
    params.append('includeDisabled', includeDisabled ? 'true' : 'false');

    const requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/products/`, requestOptions)
  }

  createProduct(product: Product): Observable<void>{
    return this.http.post(`${this.baseUrl}/products`, product)
  }

  getProduct(identifier: string): Observable<Product>{
    return this.http.get(`${this.baseUrl}/products/${identifier}`)
  }

  changeProduct(product: Product): Observable<void>{
    return this.http.put(`${this.baseUrl}/products/${product.identifier}`, product)
  }

  deleteProduct(identifier: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/products/${identifier}`)
  }

  enableProduct(identifier: string, enabled: boolean): Observable<void>{
    return this.http.put(`${this.baseUrl}/products/${identifier}/enabled`, enabled)
  }

  getProductEnabled(identifier: string): Observable<boolean>{
    return this.http.get(`${this.baseUrl}/products/${identifier}/enabled`)
  }

  incompleteaccountassignments(identifier: string): Observable<AccountAssignment[]> {
    return this.http.get(`${this.baseUrl}/products/${identifier}/incompleteaccountassignments`)
  }

  findAllTaskDefinitionsForProduct(identifier: string): Observable<TaskDefinition[]>{
    return this.http.get(`${this.baseUrl}/products/${identifier}/tasks/`)
  }

  createTaskDefinition(productIdentifier: string, taskDefinition: TaskDefinition): Observable<void>{
    return this.http.post(`${this.baseUrl}/products/${productIdentifier}/tasks/`, taskDefinition)
  }

  getTaskDefinition(productIdentifier: string, taskDefinitionIdentifier: string): Observable<TaskDefinition>{
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/tasks/${taskDefinitionIdentifier}`)
  }

  changeTaskDefinition(productIdentifier: string, taskDefinition: TaskDefinition): Observable<void>{
    return this.http.put(`${this.baseUrl}/products/${productIdentifier}/tasks/${taskDefinition.identifier}`, taskDefinition)
  }

  findAllChargeDefinitionsForProduct(identifier: string): Observable<ChargeDefinition[]>{
    return this.http.get(`${this.baseUrl}/products/${identifier}/charges/`)
  }

  createChargeDefinition(productIdentifier: string, chargeDefinition: ChargeDefinition): Observable<void>{
    return this.http.post(`${this.baseUrl}/products/${productIdentifier}/charges/`, chargeDefinition)
  }

  getChargeDefinition(productIdentifier: string, chargeDefinitionIdentifier: string): Observable<ChargeDefinition>{
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/charges/${chargeDefinitionIdentifier}`)
  }

  changeChargeDefinition(productIdentifier: string, chargeDefinition: ChargeDefinition): Observable<void>{
    return this.http.put(`${this.baseUrl}/products/${productIdentifier}/charges/${chargeDefinition.identifier}`, chargeDefinition)
  }

  deleteChargeDefinition(productIdentifier: string, chargeDefinitionIdentifier: string): Observable<void>{
    return this.http.delete(`${this.baseUrl}/products/${productIdentifier}/charges/${chargeDefinitionIdentifier}`);
  }

  getAllCasesForProduct(productIdentifier: string, fetchRequest?: FetchRequest, includeClosed?: boolean, forCustomer?: string): Observable<Case[]>{
    let params: URLSearchParams = buildSearchParams(fetchRequest);
    params.append('includeClosed', includeClosed ? 'true' : 'false');
    params.append('forCustomer', forCustomer);

    //TODO remove when the api follows fetch request naming
    params.append('page', "1");
    params.append('size', "10");

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/cases/`, requestOptions)
  }

  createCase(productIdentifier: string, caseInstance: Case): Observable<void>{
    return this.http.post(`${this.baseUrl}/products/${productIdentifier}/cases/`, caseInstance)
  }

  getCase(productIdentifier: string, caseIdentifier: string): Observable<Case>{
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/cases/${caseIdentifier}`);
  }

  changeCase(productIdentifier: string, caseInstance: Case): Observable<void>{
    return this.http.put(`${this.baseUrl}/products/${productIdentifier}/cases/${caseInstance.identifier}`, caseInstance)
  }

  getAllActionsForCase(productIdentifier: string, caseIdentifier: string): Observable<WorkflowAction[]>{
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/cases/${caseIdentifier}/actions/`)
  }

  executeCaseCommand(productIdentifier: string, caseIdentifier: string, action: string, command: CaseCommand): Observable<void>{
    return this.http.post(`${this.baseUrl}/products/${productIdentifier}/cases/${caseIdentifier}/commands/${action}`, command)
  }

  findAllTasksForCase(productIdentifier: string, caseIdentifier: string, includeExcluded?: boolean): Observable<TaskInstance[]>{
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/cases/${caseIdentifier}/tasks/`)
  }

  getTaskForCase(productIdentifier: string, caseIdentifier: string, taskIdentifier: string): Observable<TaskInstance>{
    return this.http.get(`${this.baseUrl}/products/${productIdentifier}/cases/${caseIdentifier}/tasks/${taskIdentifier}`)
  }

  taskForCaseExecuted(productIdentifier: string, caseIdentifier: string, taskIdentifier: string): Observable<void>{
    return this.http.put(`${this.baseUrl}/products/${productIdentifier}/cases/${caseIdentifier}/tasks/${taskIdentifier}`, {})
  }

  findAllCases(fetchRequest?: FetchRequest): Observable<Case[]> {
    let params: URLSearchParams = buildSearchParams(fetchRequest);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };
    return this.http.get(`${this.baseUrl}/cases/`, requestOptions)
  }

  getPaymentScheduleForCase(productIdentifier: string, caseIdentifier: string, initialDisbursalDate?: string): Observable<PlannedPaymentPage>{
    let params: URLSearchParams = new URLSearchParams();
    params.append('initialDisbursalDate', initialDisbursalDate ? new Date(initialDisbursalDate).toISOString() : undefined);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.get(`${this.baseUrl}/individuallending/products/${productIdentifier}/cases/${caseIdentifier}/plannedpayments`, requestOptions)
  }

  getAllCasesForCustomer(customerIdentifier: string, fetchRequest?: FetchRequest): Observable<CasePage>{
    let params: URLSearchParams = buildSearchParams(fetchRequest);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.get(`${this.baseUrl}/individuallending/customers/${customerIdentifier}/cases`, requestOptions);
  }

}
