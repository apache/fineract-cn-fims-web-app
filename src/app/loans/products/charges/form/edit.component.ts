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
import {ChargeDefinition} from '../../../../../services/portfolio/domain/charge-definition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CREATE, SelectAction, UPDATE} from '../../store/charges/charge.actions';
import * as fromPortfolio from '../../store';
import {PortfolioStore} from '../../store/index';
import {FimsProduct} from '../../store/model/fims-product.model';
import {RESET_FORM} from '../../store/product.actions';

@Component({
  templateUrl: './edit.component.html'
})
export class ProductChargeEditFormComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private productSubscription: Subscription;

  private chargeSubscription: Subscription;

  private product: FimsProduct;

  charge: ChargeDefinition;

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['chargeId']))
      .subscribe(this.portfolioStore);

    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .subscribe(product => this.product = product);

    this.chargeSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProductCharge)
      .subscribe(charge => this.charge = charge);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.chargeSubscription.unsubscribe();
  }

  onSave(charge: ChargeDefinition): void {
    this.portfolioStore.dispatch({ type: UPDATE, payload: {
      productId: this.product.identifier,
      charge: charge,
      activatedRoute: this.route
    }});
  }

  onCancel(): void{
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
