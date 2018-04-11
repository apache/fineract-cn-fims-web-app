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

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {environment} from './environments/environment';
import {AppModule} from './app/';
// tslint:disable-next-line:no-import-side-effect
import './rxjs.imports';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  { provide: 'tokenExpiryBuffer', useValue: 1000 * 60},
  { provide: 'cacheExpiry', useValue: 10000},
  { provide: 'identityBaseUrl', useValue: '/identity/v1' },
  { provide: 'officeBaseUrl', useValue: '/api/office/v1' },
  { provide: 'customerBaseUrl', useValue: '/api/customer/v1' },
  { provide: 'accountingBaseUrl', useValue: '/api/accounting/v1' },
  { provide: 'portfolioBaseUrl', useValue: '/api/portfolio/v1' },
  { provide: 'depositAccountBaseUrl', useValue: '/api/deposit/v1' },
  { provide: 'tellerBaseUrl', useValue: '/api/teller/v1' },
  { provide: 'reportingBaseUrl', useValue: '/api/reporting/v1' },
  { provide: 'chequeBaseUrl', useValue: '/api/cheques/v1' },
  { provide: 'payrollBaseUrl', useValue: '/api/payroll/v1' }
]).bootstrapModule(AppModule);
