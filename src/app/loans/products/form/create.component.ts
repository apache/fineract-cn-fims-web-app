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
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductFormComponent} from './form.component';
import {PortfolioStore} from '../store/index';
import {CREATE, RESET_FORM} from '../store/product.actions';
import * as fromPortfolio from '../store';
import {Error} from '../../../services/domain/error.model';
import {FimsProduct} from '../store/model/fims-product.model';
import {Currency} from '../../../services/currency/domain/currency.model';
import {CurrencyService} from '../../../services/currency/currency.service';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './create.component.html'
})
export class ProductCreateComponent implements OnInit, OnDestroy {

  @ViewChild('form') formComponent: ProductFormComponent;

  currencies$: Observable<Currency[]>;

  error$: Observable<Error>;

  product: FimsProduct = {
    identifier: '',
    name: '',
    termRange: {
      temporalUnit: 'MONTHS',
      maximum: 1
    },
    balanceRange: {
      minimum: 0,
      maximum: 0
    },
    interestRange: {
      minimum: 0,
      maximum: 0
    },
    interestBasis: 'CURRENT_BALANCE',
    patternPackage: 'org.apache.fineract.cn.portfolio.individuallending.v1',
    description: '',
    accountAssignments: [],
    currencyCode: 'USD',
    minorCurrencyUnitDigits: 2,
    enabled: false,
    parameters: {
      minimumDispersalAmount: 0,
      maximumDispersalAmount: 0,
      maximumDispersalCount: 0,
      moratoriums: []
    }
  };

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore,
              private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.error$ = this.portfolioStore.select(fromPortfolio.getProductFormError)
      .filter(error => !!error);

    this.currencies$ = this.currencyService.fetchCurrencies();
  }

  ngOnDestroy(): void {
    this.portfolioStore.dispatch({ type: RESET_FORM });
  }

  onSave(product: FimsProduct): void {
    this.portfolioStore.dispatch({ type: CREATE, payload: {
      product: product,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
