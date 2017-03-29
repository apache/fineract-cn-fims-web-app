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
import {HttpModule, Http} from '@angular/http';
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
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from 'ng2-translate';
import {CovalentCoreModule} from '@covalent/core';
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
import {CustomerTasksApiEffects} from './customers/store/tasks/effects/service.effects';
import {CustomerTasksRouteEffects} from './customers/store/tasks/effects/route.effects';
import {CustomerTasksNotificationEffects} from './customers/store/tasks/effects/notification.effects';
import {LedgerApiEffects} from './accounting/store/ledger/effects/service.effects';
import {LedgerRouteEffects} from './accounting/store/ledger/effects/route.effects';
import {LedgerNotificationEffects} from './accounting/store/ledger/effects/notification.effects';
import {JournalEntryApiEffects} from './accounting/store/ledger/journal-entry/effects/service.effects';
import {JournalEntryRouteEffects} from './accounting/store/ledger/journal-entry/effects/route.effects';
import {JournalEntryNotificationEffects} from './accounting/store/ledger/journal-entry/effects/notification.effects';
import {AccountSearchApiEffects} from './reducers/account/effects/service.effects';
import {OfficeNotificationEffects} from './offices/store/effects/notification.effects';
import {OfficeRouteEffects} from './offices/store/effects/route.effects';
import {OfficeApiEffects} from './offices/store/effects/service.effects';
import {EmployeeRouteEffects} from './employees/store/effects/route.effects';
import {EmployeeNotificationEffects} from './employees/store/effects/notification.effects';
import {EmployeeApiEffects} from './employees/store/effects/service.effects';
import {CustomerApiEffects} from './customers/store/effects/service.effects';
import {CustomerNotificationEffects} from './customers/store/effects/notification.effects';
import {CustomerRouteEffects} from './customers/store/effects/route.effects';
import {RoleApiEffects} from './roles/store/effects/service.effects';
import {RoleNotificationEffects} from './roles/store/effects/notification.effects';
import {RoleRouteEffects} from './roles/store/effects/route.effects';
import {AccountRouteEffects} from './accounting/store/account/effects/route.effects';
import {AccountNotificationEffects} from './accounting/store/account/effects/notification.effects';
import {AccountCommandNotificationEffects} from './accounting/store/account/task/effects/notification.effects';
import {AccountEntryApiEffects} from './accounting/store/account/entries/effects/service.effect';
import {AccountCommandApiEffects} from './accounting/store/account/task/effects/service.effects';
import {AccountApiEffects} from './accounting/store/account/effects/service.effects';
import {SecurityRouteEffects} from './reducers/security/effects/route.effects';
import {SecurityApiEffects} from './reducers/security/effects/service.effects';
import {SecurityNotificationEffects} from './reducers/security/effects/notification.effects';
import {CustomerCommandApiEffects} from './customers/store/commands/effects/service.effects';
import {ProductApiEffects} from './loans/products/store/effects/service.effects';
import {ProductNotificationEffects} from './loans/products/store/effects/notification.effects';
import {ProductRouteEffects} from './loans/products/store/effects/route.effects';
import {ProductTasksRouteEffects} from './loans/products/store/tasks/effects/route.effects';
import {ProductTasksApiEffects} from './loans/products/store/tasks/effects/service.effects';
import {ProductTasksNotificationEffects} from './loans/products/store/tasks/effects/notification.effects';
import {ProductChargesNotificationEffects} from './loans/products/store/charges/effects/notification.effects';
import {ProductChargesApiEffects} from './loans/products/store/charges/effects/service.effects';
import {ProductChargesRouteEffects} from './loans/products/store/charges/effects/route.effects';
import {CaseApiEffects} from './customers/cases/store/effects/service.effects';
import {CaseRouteEffects} from './customers/cases/store/effects/route.effects';
import {CaseNotificationEffects} from './customers/cases/store/effects/notification.effects';
import {CaseTasksApiEffects} from './customers/cases/store/tasks/effects/service.effects';
import {CasePaymentsApiEffects} from './customers/cases/store/payments/effects/service.effects';

export function createTranslateLoader(http: Http){
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    CovalentCoreModule.forRoot(),
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
    EffectsModule.run(EmployeeSearchApiEffects),
    EffectsModule.run(CustomerSearchApiEffects),
    EffectsModule.run(AccountSearchApiEffects),
    EffectsModule.run(RoleSearchApiEffects),


    /**
     * Module effects
     * Run from feature module when using Angular 4
     */

    /**
     * Office module effects
     */
    EffectsModule.run(OfficeApiEffects),
    EffectsModule.run(OfficeRouteEffects),
    EffectsModule.run(OfficeNotificationEffects),

    /**
     * Employee module effects
     */
    EffectsModule.run(EmployeeApiEffects),
    EffectsModule.run(EmployeeRouteEffects),
    EffectsModule.run(EmployeeNotificationEffects),

    /**
     * Role module effects
     */
    EffectsModule.run(RoleApiEffects),
    EffectsModule.run(RoleRouteEffects),
    EffectsModule.run(RoleNotificationEffects),

    /**
     * Customer module effects
     */
    EffectsModule.run(CustomerApiEffects),
    EffectsModule.run(CustomerRouteEffects),
    EffectsModule.run(CustomerNotificationEffects),

    EffectsModule.run(CustomerTasksApiEffects),
    EffectsModule.run(CustomerTasksRouteEffects),
    EffectsModule.run(CustomerTasksNotificationEffects),

    EffectsModule.run(CustomerCommandApiEffects),

    /**
     * Accounting module effects
     */
    EffectsModule.run(LedgerApiEffects),
    EffectsModule.run(LedgerRouteEffects),
    EffectsModule.run(LedgerNotificationEffects),

    EffectsModule.run(JournalEntryApiEffects),
    EffectsModule.run(JournalEntryRouteEffects),
    EffectsModule.run(JournalEntryNotificationEffects),

    EffectsModule.run(AccountApiEffects),
    EffectsModule.run(AccountRouteEffects),
    EffectsModule.run(AccountNotificationEffects),
    EffectsModule.run(AccountEntryApiEffects),
    EffectsModule.run(AccountCommandApiEffects),
    EffectsModule.run(AccountCommandNotificationEffects),

    /**
     * Portfolio module effects
     */
    EffectsModule.run(ProductApiEffects),
    EffectsModule.run(ProductRouteEffects),
    EffectsModule.run(ProductNotificationEffects),

    EffectsModule.run(ProductTasksApiEffects),
    EffectsModule.run(ProductTasksRouteEffects),
    EffectsModule.run(ProductTasksNotificationEffects),

    EffectsModule.run(ProductChargesApiEffects),
    EffectsModule.run(ProductChargesRouteEffects),
    EffectsModule.run(ProductChargesNotificationEffects),

    EffectsModule.run(CaseApiEffects),
    EffectsModule.run(CaseRouteEffects),
    EffectsModule.run(CaseNotificationEffects),

    EffectsModule.run(CaseTasksApiEffects),
    EffectsModule.run(CasePaymentsApiEffects)

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
    NotificationService,
    ...appRoutingProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
