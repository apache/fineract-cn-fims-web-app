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
import {Observable} from 'rxjs';
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

@Injectable()
export class CustomerService {

  constructor(@Inject('customerBaseUrl') private baseUrl: string, private http: HttpClient, private imageService: ImageService) {}

  fetchCustomers(fetchRequest: FetchRequest): Observable<CustomerPage> {
    let params: URLSearchParams = buildSearchParams(fetchRequest);

    let requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.get(`${this.baseUrl}/customers`, requestOptions).share();
  }

  getCustomer(id: string, silent?: boolean): Observable<Customer>{
    return this.http.get(`${this.baseUrl}/customers/${id}`, {}, silent);
  }

  createCustomer(customer: Customer): Observable<Customer>{
    return this.http.post(`${this.baseUrl}/customers`, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer>{
    return this.http.put(`${this.baseUrl}/customers/${customer.identifier}`, customer);
  }

  executeCustomerCommand(id: string, command: Command): Observable<void>{
    return this.http.post(`${this.baseUrl}/customers/${id}/commands`, command);
  }

  listCustomerCommand(id: string): Observable<Command[]>{
    return this.http.get(`${this.baseUrl}/customers/${id}/commands`);
  }

  addTaskToCustomer(customerId: string, taskId: string): Observable<void>{
    return this.http.post(`${this.baseUrl}/customers/${customerId}/tasks/${taskId}`, {})
  }

  markTaskAsExecuted(customerId: string, taskId: string): Observable<void>{
    return this.http.put(`${this.baseUrl}/customers/${customerId}/tasks/${taskId}`, {});
  }

  fetchCustomerTasks(customerId: string, includeExecuted?: boolean): Observable<TaskDefinition[]>{
    return this.http.get(`${this.baseUrl}/customers/${customerId}/tasks`)
  }

  fetchTasks(): Observable<TaskDefinition[]> {
    return this.http.get(`${this.baseUrl}/tasks`)
  }

  createTask(task: TaskDefinition): Observable<void> {
    return this.http.post(`${this.baseUrl}/tasks`, task);
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
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/portrait`)
  }

  fetchIdentificationCards(customerId: string): Observable<IdentificationCard[]> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/identifications`)
  }

  getIdentificationCard(customerId: string, number: string): Observable<IdentificationCard> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/identifications/${number}`)
  }

  createIdentificationCard(customerId: string, identificationCard: IdentificationCard): Observable<void> {
    return this.http.post(`${this.baseUrl}/customers/${customerId}/identifications`, identificationCard)
  }

  updateIdentificationCard(customerId: string, identificationCard: IdentificationCard): Observable<void> {
    return this.http.put(`${this.baseUrl}/customers/${customerId}/identifications/${identificationCard.number}`, identificationCard)
  }

  deleteIdentificationCard(customerId: string, number: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}/identifications/${number}`)
  }
}
