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
import {ActivatedRoute, Router} from '@angular/router';
import * as fromPortfolio from '../../../store/index';
import {PortfolioStore} from '../../../store/index';
import {RangeActions} from '../../../store/ranges/range.actions';
import {FimsProduct} from '../../../store/model/fims-product.model';
import {Subscription} from 'rxjs/Subscription';
import {FimsRange} from '../../../../../services/portfolio/domain/range-model';

@Component({
  templateUrl: './create.component.html'
})
export class CreateProductChargeRangeFormComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  private product: FimsProduct;

  range: FimsRange = {
    identifier: '',
    segments: [
      { identifier: 'Start', start: 0 }
    ]
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

  save(resource: FimsRange): void {
    this.portfolioStore.dispatch(RangeActions.createAction({
      resource,
      data: {
        productIdentifier: this.product.identifier,
        activatedRoute: this.route
      }
    }));
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
