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
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CaseFormComponent} from './form.component';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import * as fromCustomers from '../../store/index';
import {Subscription} from 'rxjs/Subscription';
import {CREATE, RESET_FORM} from '../store/case.actions';
import {Error} from '../../../services/domain/error.model';
import {Product} from '../../../services/portfolio/domain/product.model';
import {PortfolioService} from '../../../services/portfolio/portfolio.service';
import {Observable} from 'rxjs/Observable';
import {DepositAccountService} from '../../../services/depositAccount/deposit-account.service';
import {ProductInstance} from '../../../services/depositAccount/domain/instance/product-instance.model';
import {FimsCase} from '../../../services/portfolio/domain/fims-case.model';
import {Customer} from '../../../services/customer/domain/customer.model';

@Component({
  templateUrl: './create.component.html'
})
export class CaseCreateComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  fullName: string;

  @ViewChild('form') formComponent: CaseFormComponent;

  products$: Observable<Product[]>;

  productsInstances$: Observable<ProductInstance[]>;

  customer$: Observable<Customer>;

  caseInstance: FimsCase = {
    currentState: 'CREATED',
    identifier: '',
    productIdentifier: '',
    parameters: {
      customerIdentifier: '',
      maximumBalance: 0,
      paymentCycle: {
        alignmentDay: null,
        alignmentMonth: null,
        alignmentWeek: null,
        period: 1,
        temporalUnit: 'MONTHS',
      },
      termRange: {
        temporalUnit: 'MONTHS',
        maximum: 1
      },
      creditWorthinessSnapshots: []
    },
    interest: 0,
    depositAccountIdentifier: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore,
              private portfolioService: PortfolioService, private depositService: DepositAccountService) {}

  ngOnInit(): void {
    this.customer$ = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .filter(customer => !!customer)
      .do(customer => this.fullName = `${customer.givenName} ${customer.surname}`);

    this.formStateSubscription = this.casesStore.select(fromCases.getCaseFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.formComponent.showIdentifierValidationError());

    this.products$ = this.portfolioService.findAllProducts(false)
      .map(productPage => productPage.elements);

    this.productsInstances$ = this.customer$
      .switchMap(customer => this.depositService.fetchProductInstances(customer.identifier))
      .map((instances: ProductInstance[]) => instances.filter(instance => instance.state === 'ACTIVE'));
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.casesStore.dispatch({ type: RESET_FORM });
  }

  onSave(caseInstance: FimsCase): void {
    this.casesStore.dispatch({ type: CREATE, payload: {
      productId: caseInstance.productIdentifier,
      caseInstance,
      activatedRoute: this.route
    }});
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
