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
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {appRoutes, appRoutingProviders} from './app.routes';
import {HttpClient} from './services/http/http.service';
import {IdentityService} from './services/identity/identity.service';
import {OfficeService} from './services/office/office.service';
import {CustomerService} from './services/customer/customer.service';
import {AuthenticationService} from './services/security/authn/authentication.service';
import {CatalogService} from './services/catalog/catalog.service';
import {AccountingService} from './services/accounting/accounting.service';
import {PortfolioService} from './services/portfolio/portfolio.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PermittableGroupIdMapper} from './services/security/authz/permittable-group-id-mapper';
import {reducer} from './store';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NotificationService} from './services/notification/notification.service';
import {OfficeSearchApiEffects} from './store/office/effects/service.effects';
import {EmployeeSearchApiEffects} from './store/employee/effects/service.effects';
import {RoleSearchApiEffects} from './store/role/effects/service.effects';
import {CustomerSearchApiEffects} from './store/customer/effects/service.effects';
import {AccountSearchApiEffects} from './store/account/effects/service.effects';
import {SecurityRouteEffects} from './store/security/effects/route.effects';
import {SecurityApiEffects} from './store/security/effects/service.effects';
import {SecurityNotificationEffects} from './store/security/effects/notification.effects';
import {LedgerSearchApiEffects} from './store/ledger/effects/service.effects';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExistsGuardService} from './common/guards/exists-guard';
import {CountryService} from './services/country/country.service';
import {ImageService} from './services/image/image.service';
import {DepositAccountService} from './services/depositAccount/deposit-account.service';
import {CurrencyService} from './services/currency/currency.service';
import {TellerService} from './services/teller/teller-service';
import {ReportingService} from './services/reporting/reporting.service';
import {getSelectedLanguage} from './common/i18n/translate';
import {ChequeService} from './services/cheque/cheque.service';
import {PayrollService} from './services/payroll/payroll.service';

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    appRoutes,
    StoreModule.provideStore(reducer),

    /**
     * Root effects
     */
    EffectsModule.run(SecurityApiEffects),
    EffectsModule.run(SecurityRouteEffects),
    EffectsModule.run(SecurityNotificationEffects),

    EffectsModule.run(OfficeSearchApiEffects),
    EffectsModule.run(EmployeeSearchApiEffects),
    EffectsModule.run(CustomerSearchApiEffects),
    EffectsModule.run(AccountSearchApiEffects),
    EffectsModule.run(RoleSearchApiEffects),
    EffectsModule.run(LedgerSearchApiEffects)
  ],
  providers: [
    HttpClient,
    AuthenticationService,
    PermittableGroupIdMapper,
    IdentityService,
    OfficeService,
    CustomerService,
    CatalogService,
    AccountingService,
    PortfolioService,
    DepositAccountService,
    TellerService,
    ReportingService,
    ChequeService,
    PayrollService,
    CountryService,
    CurrencyService,
    NotificationService,
    ExistsGuardService,
    ...appRoutingProviders,
    ImageService,
    {
      provide: LOCALE_ID, useFactory: getSelectedLanguage, deps: [TranslateService],
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
