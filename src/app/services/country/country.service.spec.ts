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

import {fakeAsync, tick} from '@angular/core/testing';
import {CountryService} from './country.service';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions, ResponseOptions} from '@angular/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {ReflectiveInjector} from '@angular/core';

describe('Test country service', () => {

  beforeEach(() => {
    const translateService = {
      onLangChange: Observable.empty()
    };

    this.injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      {provide: TranslateService, useValue: translateService},
      Http,
      CountryService
    ]);
    this.countryService = this.injector.get(CountryService);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });

  xit('should return countries when term contains brackets', fakeAsync(() => {
    // TODO find out why mock connection returns a rejected promise
    this.countryService.init();

    const mockResponse = [
      {name: 'Country (A)', displayName: 'Country (A)', alpha2Code: '', translations: {}},
      {name: 'Country (B)', displayName: 'Country (B)', alpha2Code: '', translations: {}}
    ];

    this.lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(mockResponse)
    })));

    tick();

    const result = this.countryService.fetchCountries('Country (A)');

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockResponse[0]);
  }));

});
