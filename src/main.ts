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

import './polyfills.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  { provide: 'tenantId', useValue: 'provisioning_integration_test' },
  { provide: 'tokenExpiryBuffer', useValue: 1000 * 60},
  { provide: 'identityBaseUrl', useValue: '/identity/v1' },
  { provide: 'officeBaseUrl', useValue: '/office/v1' },
  { provide: 'customerBaseUrl', useValue: '/customer/v1' },
  { provide: 'accountingBaseUrl', useValue: '/accounting/v1' },
  { provide: 'portfolioBaseUrl', useValue: '/portfolio/v1' }
]).bootstrapModule(AppModule);
