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
import {ActivatedRoute} from '@angular/router';
import {ChargeDefinition} from '../../../../services/portfolio/domain/charge-definition.model';
import {Observable, Subscription} from 'rxjs';
import {TdDialogService} from '@covalent/core';
import {DELETE, SelectAction} from '../store/charges/charge.actions';
import {PortfolioStore} from '../store/index';
import * as fromPortfolio from '../store';
import {FimsProduct} from '../store/model/fims-product.model';

@Component({
  templateUrl: './charge.detail.component.html'
})
export class ProductChargeDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private productSubscription: Subscription;

  private chargeSubscription: Subscription;

  private product: FimsProduct;

  charge: ChargeDefinition;

  constructor(private route: ActivatedRoute, private dialogService: TdDialogService, private portfolioStore: PortfolioStore){}

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

  confirmDeletion(): Observable<boolean>{
    return this.dialogService.openConfirm({
      message: 'Do you want to delete charge "' + this.charge.identifier + '"?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE CHARGE',
    }).afterClosed();
  }

  deleteCharge(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.portfolioStore.dispatch({ type: DELETE, payload: {
          productId: this.product.identifier,
          charge: this.charge,
          activatedRoute: this.route
        }});
      });
  }

}
