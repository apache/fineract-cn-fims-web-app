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
import {Case} from '../../../../services/portfolio/domain/case.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {CasesStore} from '../store/index';
import {SelectAction, UPDATE} from '../store/case.actions';
import * as customerActions from '../../store/customer.actions';
import {Subscription} from 'rxjs';
import * as fromCases from '../store/index';
import * as fromCustomers from '../../store/index';
import {FimsCase} from '../store/model/fims-case.model';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {Observable} from 'rxjs/Observable';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';

@Component({
  templateUrl: './edit.component.html'
})
export class CaseEditComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private customerSubscription: Subscription;

  private caseSubscription: Subscription;

  private productId: string;

  products$: Observable<Product[]>;

  customer: Customer;

  caseInstance: FimsCase;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore, private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['productId']
    });

    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['caseId']))
      .subscribe(this.casesStore);

    this.caseSubscription = this.casesStore.select(fromCases.getSelectedCase)
      .subscribe(caseInstance => this.caseInstance = caseInstance);

    this.customerSubscription = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);

    this.products$ = this.portfolioService.findAllProducts(false)
      .map(productPage => productPage.elements);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
    this.caseSubscription.unsubscribe();
  }

  onSave(caseInstance: Case) {
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
