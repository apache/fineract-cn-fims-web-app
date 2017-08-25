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
import {BalanceSegmentSet} from '../../../../../services/portfolio/domain/balance-segment-set.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PortfolioStore} from '../../../store/index';
import {RangeActions} from '../../../store/ranges/range.actions';
import {FimsProduct} from '../../../store/model/fims-product.model';
import {Subscription} from 'rxjs/Subscription';
import * as fromPortfolio from '../../../store/index';

@Component({
  templateUrl: './create.component.html'
})
export class CreateProductChargeRangeFormComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  private product: FimsProduct;

  balanceSegmentSet: BalanceSegmentSet = {
    identifier: '',
    segments: [0],
    segmentIdentifiers: ['Start']
  };

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => this.product = product);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  save(resource: BalanceSegmentSet): void {
    this.portfolioStore.dispatch(RangeActions.createAction({
      resource,
      data: {
        productIdentifier: this.product.identifier,
        activatedRoute: this.route
      }
    }))
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
