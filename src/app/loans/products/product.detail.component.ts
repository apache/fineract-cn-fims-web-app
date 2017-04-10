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
import {FormControl} from '@angular/forms';
import {PortfolioStore} from './store/index';
import {ENABLE, SelectAction} from './store/product.actions';
import {Subscription} from 'rxjs';
import * as fromPortfolio from './store';
import {FimsProduct} from './store/model/fims-product.model';

@Component({
  templateUrl: './product.detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy{

  private productSubscription: Subscription;

  private actionsSubscription: Subscription;

  product: FimsProduct;

  enabledControl: FormControl;

  constructor(private route: ActivatedRoute, private portfolioStore: PortfolioStore){}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['productId']))
      .subscribe(this.portfolioStore);

    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => {
        this.product = product;

        this.enabledControl = new FormControl(product.enabled);

        this.enabledControl.valueChanges
          .debounceTime(500)
          .subscribe(event => this.portfolioStore.dispatch({ type: ENABLE, payload: {
            product: this.product,
            enable: event
          } }));
      });
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }

  get numberFormat(): string {
    let digits = 2;
    if(this.product){
      digits = this.product.minorCurrencyUnitDigits;
    }
    return `1.${digits}-${digits}`;
  }

}
