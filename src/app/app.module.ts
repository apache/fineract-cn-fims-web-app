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
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {appRoutes, appRoutingProviders} from './app.routes';
import {HttpClient} from '../services/http/http.service';
import {IdentityService} from '../services/identity/identity.service';
import {OfficeService} from '../services/office/office.service';
import {CustomerService} from '../services/customer/customer.service';
import {AuthenticationService} from '../services/security/authn/authentication.service';
import {CatalogService} from '../services/catalog/catalog.service';
import {AccountingService} from '../services/accounting/accounting.service';
import {PortfolioService} from '../services/portfolio/portfolio.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PermittableGroupIdMapper} from '../services/security/authz/permittable-group-id-mapper';
import {reducer} from './reducers';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NotificationService} from '../services/notification/notification.service';
import {OfficeSearchApiEffects} from './reducers/office/effects/service.effects';
import {EmployeeSearchApiEffects} from './reducers/employee/effects/service.effects';
import {RoleSearchApiEffects} from './reducers/role/effects/service.effects';
import {CustomerSearchApiEffects} from './reducers/customer/effects/service.effects';
import {AccountSearchApiEffects} from './reducers/account/effects/service.effects';
import {SecurityRouteEffects} from './reducers/security/effects/route.effects';
import {SecurityApiEffects} from './reducers/security/effects/service.effects';
import {SecurityNotificationEffects} from './reducers/security/effects/notification.effects';
import {LedgerSearchApiEffects} from './reducers/ledger/effects/service.effects';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExistsGuardService} from '../common/guards/exists-guard';
import {CountryService} from '../services/country/country.service';
import {CountrySearchApiEffects} from './reducers/country/service.effects';
import {ImageService} from '../services/image/image.service';
import {DepositAccountService} from '../services/depositAccount/deposit-account.service';
import {CurrencyService} from '../services/currency/currency.service';
import {TellerService} from '../services/teller/teller-service';

export function HttpLoaderFactory(http: Http){
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

    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    }),

    /**
     * Root effects
     */
    EffectsModule.run(SecurityApiEffects),
    EffectsModule.run(SecurityRouteEffects),
    EffectsModule.run(SecurityNotificationEffects),

    EffectsModule.run(OfficeSearchApiEffects),
    EffectsModule.run(CountrySearchApiEffects),
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
    CountryService,
    CurrencyService,
    NotificationService,
    ExistsGuardService,
    ...appRoutingProviders,
    ImageService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
