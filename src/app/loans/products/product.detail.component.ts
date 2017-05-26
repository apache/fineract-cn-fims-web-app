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
import {PortfolioStore} from './store/index';
import {ENABLE, SelectAction} from './store/product.actions';
import {Subscription} from 'rxjs';
import * as fromPortfolio from './store';
import * as fromRoot from '../../reducers';
import {FimsProduct} from './store/model/fims-product.model';
import {FimsPermission} from '../../../services/security/authz/fims-permission.model';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './product.detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy{

  private productSubscription: Subscription;

  private actionsSubscription: Subscription;

  product: FimsProduct;

  canEdit$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private portfolioStore: PortfolioStore){}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['productId']))
      .subscribe(this.portfolioStore);

    const product$: Observable<FimsProduct> = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .filter(product => !!product);

    this.productSubscription = product$
      .subscribe(product => this.product = product);

    this.canEdit$ = Observable.combineLatest(
      this.portfolioStore.select(fromRoot.getPermissions),
      product$,
      (permissions, product: FimsProduct) => ({
        hasPermission: this.hasChangePermission(permissions),
        isEnabled: product.enabled
      }))
      .map(result => result.hasPermission && !result.isEnabled);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }

  enableProduct(): void {
    this.portfolioStore.dispatch({ type: ENABLE, payload: {
      product: this.product,
      enable: true
    } })
  }

  disableProduct(): void {
    this.portfolioStore.dispatch({ type: ENABLE, payload: {
      product: this.product,
      enable: false
    } })
  }

  get numberFormat(): string {
    let digits = 2;
    if(this.product){
      digits = this.product.minorCurrencyUnitDigits;
    }
    return `1.${digits}-${digits}`;
  }

  private hasChangePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
        permission.id === 'portfolio_products' &&
        permission.accessLevel === 'CHANGE'
      ).length > 0
  }

}
