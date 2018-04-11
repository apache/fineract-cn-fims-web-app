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
import {Catalog} from './domain/catalog.model';
import {Field} from './domain/field.model';

@Injectable()
export class CatalogService {

  constructor(@Inject('customerBaseUrl') private baseUrl: string, private  http: HttpClient) {
  }

  fetchCatalogs(): Observable<Catalog[]> {
    return this.http.get(`${this.baseUrl}/catalogs`);
  }

  createCatalog(catalog: Catalog): Observable<void> {
    return this.http.post(`${this.baseUrl}/catalogs`, catalog);
  }

  updateCatalog(catalog: Catalog): Observable<void> {
    return this.http.put(`${this.baseUrl}/catalogs/${catalog.identifier}`, catalog);
  }

  deleteCatalog(catalog: Catalog): Observable<void> {
    return this.http.delete(`${this.baseUrl}/catalogs/${catalog.identifier}`, {});
  }

  findCatalog(identifier: string, silent: boolean = false): Observable<Catalog> {
    return this.http.get(`${this.baseUrl}/catalogs/${identifier}`, {}, silent);
  }

  updateField(catalogIdentifier: string, field: Field): Observable<void> {
    return this.http.put(`${this.baseUrl}/catalogs/${catalogIdentifier}/fields/${field.identifier}`, field);
  }

  deleteField(catalogIdentifier: string, field: Field): Observable<void> {
    return this.http.delete(`${this.baseUrl}/catalogs/${catalogIdentifier}/fields/${field.identifier}`, );
  }
}
