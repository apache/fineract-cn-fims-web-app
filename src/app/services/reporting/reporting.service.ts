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
import {ReportDefinition} from './domain/report-definition.model';
import {FetchRequest} from '../domain/paging/fetch-request.model';
import {ReportPage} from './domain/report-page.model';
import {ReportRequest} from './domain/report-request.model';
import {RequestOptionsArgs, URLSearchParams} from '@angular/http';
import {buildSearchParams} from '../domain/paging/search-param.builder';

@Injectable()
export class ReportingService {

  constructor(private http: HttpClient, @Inject('reportingBaseUrl') private baseUrl: string) {
  }

  fetchCategories(): Observable<string[]> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  fetchReportDefinitions(category: string): Observable<ReportDefinition[]> {
    return this.http.get(`${this.baseUrl}/categories/${category}`);
  }

  findReportDefinition(category: string, identifier: string): Observable<ReportDefinition> {
    return this.http.get(`${this.baseUrl}/categories/${category}/definitions/${identifier}`);
  }

  generateReport(category: string, identifier: string, reportRequest: ReportRequest, fetchRequest?: FetchRequest): Observable<ReportPage> {
    const params: URLSearchParams = buildSearchParams(fetchRequest);

    const requestOptions: RequestOptionsArgs = {
      search: params
    };

    return this.http.post(`${this.baseUrl}/categories/${category}/reports/${identifier}`, reportRequest, requestOptions);
  }

}
