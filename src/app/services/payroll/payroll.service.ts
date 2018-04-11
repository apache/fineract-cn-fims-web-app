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
import {RequestOptionsArgs} from '@angular/http';
import {buildSearchParams} from '../domain/paging/search-param.builder';
import {PayrollPaymentPage} from './domain/payroll-payment-page.model';
import {Observable} from 'rxjs/Observable';
import {FetchRequest} from '../domain/paging/fetch-request.model';
import {PayrollCollectionHistory} from './domain/payroll-collection-history.model';
import {PayrollCollectionSheet} from './domain/payroll-collection-sheet.model';
import {HttpClient} from '../http/http.service';
import {PayrollConfiguration} from './domain/payroll-configuration.model';

@Injectable()
export class PayrollService {

  constructor(private http: HttpClient, @Inject('payrollBaseUrl') private baseUrl: string) {
  }

  public distribute(sheet: PayrollCollectionSheet): Observable<void> {
    return this.http.post(`${this.baseUrl}/distribution`, sheet);
  }

  public fetchDistributionHistory(): Observable<PayrollCollectionHistory[]> {
    return this.http.get(`${this.baseUrl}/distribution`);
  }

  public fetchPayments(identifier: string, fetchRequest?: FetchRequest): Observable<PayrollPaymentPage> {
    const params: URLSearchParams = buildSearchParams(fetchRequest);

    const requestOptions: RequestOptionsArgs = {
      params
    };
    return this.http.get(`${this.baseUrl}/distribution/${identifier}/payments`, requestOptions);
  }

  setPayrollConfiguration(customerId: string, configuration: PayrollConfiguration): Observable<void> {
    return this.http.put(`${this.baseUrl}/customers/${customerId}/payroll`, configuration);
  }

  findPayrollConfiguration(customerId: string, silent: boolean = false): Observable<PayrollConfiguration> {
    return this.http.get(`${this.baseUrl}/customers/${customerId}/payroll`, {}, silent);
  }
}
