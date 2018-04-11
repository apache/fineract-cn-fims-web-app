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
import {Observable} from 'rxjs/Observable';
import {Customer} from './domain/customer.model';
import {HttpClient} from '../http/http.service';
import {CustomerPage} from './domain/customer-page.model';
import {FetchRequest} from '../domain/paging/fetch-request.model';
import {buildSearchParams} from '../domain/paging/search-param.builder';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {Command} from './domain/command.model';
import {TaskDefinition} from './domain/task-definition.model';
import {ImageService} from '../image/image.service';
import {IdentificationCard} from './domain/identification-card.model';
import {IdentificationCardScan} from './domain/identification-card-scan.model';
import {ProcessStep} from './domain/process-step.model';
import {CustomerDocument} from './domain/customer-document.model';

@Injectable()
export class CustomerService {

  constructor(@Inject('customerBaseUrl') private baseUrl: string, private http: HttpClient, private imageService: ImageService) {
  }

  fetchCustomers(fetchRequest: FetchRequest): Observable<CustomerPage> {
    const params: URLSearchParams = buildSearchParams(fetchRequest);

    const requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.get(`${this.baseUrl}/customers`, requestOptions).share();
  }

  getCustomer(id: string, silent?: boolean): Observable<Customer> {
    return this.http.get(`${this.baseUrl}/customers/${id}`, {}, silent);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post(`${this.baseUrl}/customers`, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put(`${this.baseUrl}/customers/${customer.identifier}`, customer);
  }

  executeCustomerCommand(id: string, command: Command): Observable<void> {
    return this.http.post(`${this.baseUrl}/customers/${id}/commands`, command);
  }

  listCustomerCommand(id: string): Observable<Command[]> {
    return this.http.get(`${this.baseUrl}/customers/${id}/commands`);
  }

  addTaskToCustomer(customerId: string, taskId: string): Observable<void> {
    return this.http.post(`${this.baseUrl}/customers/${customerId}/tasks/${taskId}`, {});
  }

  markTaskAsExecuted(customerId: string, taskId: string): Observable<void> {
    return this.http.put(`${this.baseUrl}/customers/${customerId}/tasks/${taskId}`, {});
  }

  fetchCustomerTasks(customerId: string, includeExecuted?: boolean): Observable<TaskDefinition[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/tasks`);
  }

  fetchTasks(): Observable<TaskDefinition[]> {
    return this.http.get(`${this.baseUrl}/tasks`);
  }

  getTask(identifier: string): Observable<TaskDefinition> {
    return this.http.get(`${this.baseUrl}/tasks/${identifier}`);
  }

  createTask(task: TaskDefinition): Observable<void> {
    return this.http.post(`${this.baseUrl}/tasks`, task);
  }

  updateTask(task: TaskDefinition): Observable<void> {
    return this.http.put(`${this.baseUrl}/tasks/${task.identifier}`, task);
  }

  fetchProcessSteps(customerId: string): Observable<ProcessStep[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/actions`);
  }

  getPortrait(customerId: string): Observable<Blob> {
    return this.imageService.getImage(`${this.baseUrl}/customers/${customerId}/portrait`);
  }

  uploadPortrait(customerId: string, file: File): Observable<void> {
    const formData = new FormData();

    formData.append('portrait', file, file.name);

    return this.http.post(`${this.baseUrl}/customers/${customerId}/portrait`, formData);
  }

  deletePortrait(customerId: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/portrait`);
  }

  fetchIdentificationCards(customerId: string): Observable<IdentificationCard[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/identifications`);
  }

  getIdentificationCard(customerId: string, number: string): Observable<IdentificationCard> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/identifications/${number}`);
  }

  createIdentificationCard(customerId: string, identificationCard: IdentificationCard): Observable<void> {
    return this.http.post(`${this.baseUrl}/customers/${customerId}/identifications`, identificationCard);
  }

  updateIdentificationCard(customerId: string, identificationCard: IdentificationCard): Observable<void> {
    return this.http.put(`${this.baseUrl}/customers/${customerId}/identifications/${identificationCard.number}`, identificationCard);
  }

  deleteIdentificationCard(customerId: string, number: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/identifications/${number}`);
  }

  fetchIdentificationCardScans(customerId: string, number: string): Observable<IdentificationCardScan[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/identifications/${number}/scans`);
  }

  getIdentificationCardScanImage(customerId: string, number: string, scanId: string): Observable<Blob> {
    return this.imageService.getImage(`${this.baseUrl}/customers/${customerId}/identifications/${number}/scans/${scanId}/image`);
  }

  uploadIdentificationCardScan(customerId: string, number: string, scan: IdentificationCardScan, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const params = new URLSearchParams();
    params.append('scanIdentifier', scan.identifier);
    params.append('description', scan.description);

    const requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.post(`${this.baseUrl}/customers/${customerId}/identifications/${number}/scans`, formData, requestOptions);
  }

  deleteIdentificationCardScan(customerId: string, number: string, scanId: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/identifications/${number}/scans/${scanId}`);
  }

  getDocuments(customerId: string): Observable<CustomerDocument[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/documents`);
  }

  getDocument(customerId: string, documentId: string): Observable<CustomerDocument> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/documents/${documentId}`);
  }

  createDocument(customerId: string, document: CustomerDocument): Observable<void> {
    return this.http.post(`${this.baseUrl}/customers/${customerId}/documents/${document.identifier}`, document);
  }

  updateDocument(customerId: string, document: CustomerDocument): Observable<void> {
    return this.http.put(`${this.baseUrl}/customers/${customerId}/documents/${document.identifier}`, document);
  }

  deleteDocument(customerId: string, document: CustomerDocument): Observable<void> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/documents/${document.identifier}`);
  }

  completeDocument(customerId: string, documentId: string, silent: boolean = false): Observable<void> {
    return this.http.post(`${this.baseUrl}/customers/${customerId}/documents/${documentId}/completed`, true, {}, silent);
  }

  getDocumentPageNumbers(customerId: string, documentId: string): Observable<number[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/documents/${documentId}/pages`);
  }

  getDocumentPage(customerId: string, documentId: string, pageNumber: number): Observable<Blob> {
    return this.imageService.getImage(`${this.baseUrl}/customers/${customerId}/documents/${documentId}/pages/${pageNumber}`);
  }

  createDocumentPage(customerId: string, documentId: string, pageNumber: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('page', file, file.name);

    return this.http.post(`${this.baseUrl}/customers/${customerId}/documents/${documentId}/pages/${pageNumber}`, formData);
  }

  deleteDocumentPage(customerId: string, documentId: string, pageNumber: number): Observable<void> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/documents/${documentId}/pages/${pageNumber}`);
  }

}
