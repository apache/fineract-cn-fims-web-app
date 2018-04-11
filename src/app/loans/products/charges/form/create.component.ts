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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChargeDefinition} from '../../../../services/portfolio/domain/charge-definition.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromPortfolio from '../../store/index';
import {PortfolioStore} from '../../store/index';
import {Subscription} from 'rxjs/Subscription';
import {CREATE} from '../../store/charges/charge.actions';
import {FimsProduct} from '../../store/model/fims-product.model';
import {Observable} from 'rxjs/Observable';
import {RangeActions} from '../../store/ranges/range.actions';
import {FimsRange} from '../../../../services/portfolio/domain/range-model';

@Component({
  templateUrl: './create.component.html'
})
export class ProductChargeCreateFormComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  private product: FimsProduct;

  ranges$: Observable<FimsRange[]>;

  charge: ChargeDefinition = {
    identifier: '',
    name: '',
    description: '',
    chargeAction: 'OPEN',
    amount: 0,
    chargeMethod: 'FIXED',
    fromAccountDesignator: '',
    toAccountDesignator: '',
    forCycleSizeUnit: 'WEEKS',
    proportionalTo: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .do(product => this.portfolioStore.dispatch(RangeActions.loadAllAction(product.identifier)))
      .subscribe(product => this.product = product);

    this.ranges$ = this.portfolioStore.select(fromPortfolio.getAllProductChargeRangeEntities);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  onSave(charge: ChargeDefinition): void {
    this.portfolioStore.dispatch({ type: CREATE, payload: {
      productId: this.product.identifier,
      charge: charge,
      activatedRoute: this.route
    }});
  }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
