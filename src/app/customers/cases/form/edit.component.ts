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
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../../services/customer/domain/customer.model';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import {UPDATE} from '../store/case.actions';
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
export class CaseEditComponent implements OnInit {

  private productId: string;

  fullName: string;

  products$: Observable<Product[]>;

  productsInstances$: Observable<ProductInstance[]>;

  customer$: Observable<Customer>;

  caseInstance$: Observable<FimsCase>;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore,
              private portfolioService: PortfolioService, private depositService: DepositAccountService) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.productId = params['productId'];
    });

    this.caseInstance$ = this.casesStore.select(fromCases.getSelectedCase)
      .filter(caseInstance => !!caseInstance);

    this.customer$ = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .filter(customer => !!customer)
      .do(customer => this.fullName = `${customer.givenName} ${customer.surname}`);

    this.products$ = this.portfolioService.findAllProducts(false)
      .map(productPage => productPage.elements);

    this.productsInstances$ = this.customer$
      .switchMap(customer => this.depositService.fetchProductInstances(customer.identifier))
      .map((instances: ProductInstance[]) => instances.filter(instance => instance.state === 'ACTIVE'));
  }

  onSave(caseInstance: FimsCase) {
    this.casesStore.dispatch({ type: UPDATE, payload: {
      productId: this.productId,
      caseInstance,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
