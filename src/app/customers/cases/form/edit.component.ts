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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../../services/customer/domain/customer.model';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import {SelectAction, UPDATE} from '../store/case.actions';
import {Subscription} from 'rxjs';
import * as fromCustomers from '../../store/index';
import {Product} from '../../../services/portfolio/domain/product.model';
import {Observable} from 'rxjs/Observable';
import {PortfolioService} from '../../../services/portfolio/portfolio.service';
import {ProductInstance} from '../../../services/depositAccount/domain/instance/product-instance.model';
import {DepositAccountService} from '../../../services/depositAccount/deposit-account.service';
import {FimsCase} from '../../../services/portfolio/domain/fims-case.model';

@Component({
  templateUrl: './edit.component.html'
})
export class CaseEditComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private customerSubscription: Subscription;

  private caseSubscription: Subscription;

  private productId: string;

  products$: Observable<Product[]>;

  productsInstances$: Observable<ProductInstance[]>;

  customer: Customer;

  caseInstance: FimsCase;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore, private portfolioService: PortfolioService, private depositService: DepositAccountService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['productId']
    });

    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['caseId']))
      .subscribe(this.casesStore);

    this.caseSubscription = this.casesStore.select(fromCases.getSelectedCase)
      .filter(caseInstance => !!caseInstance)
      .subscribe(caseInstance => this.caseInstance = caseInstance);

    const selectedCustomer$ = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .filter(customer => !!customer);

    this.customerSubscription = selectedCustomer$
      .subscribe(customer => this.customer = customer);

    this.products$ = this.portfolioService.findAllProducts(false)
      .map(productPage => productPage.elements);

    this.productsInstances$ = selectedCustomer$
      .flatMap(customer => this.depositService.fetchProductInstances(customer.identifier));
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
    this.caseSubscription.unsubscribe();
  }

  onSave(caseInstance: FimsCase) {
    this.casesStore.dispatch({ type: UPDATE, payload: {
      productId: this.productId,
      caseInstance: caseInstance,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  private navigateAway() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
