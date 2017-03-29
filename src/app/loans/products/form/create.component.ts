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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductParameters} from '../../../../services/portfolio/domain/individuallending/product-parameters.model';
import {ProductFormComponent} from './form.component';
import {PortfolioStore} from '../store/index';
import {CREATE} from '../store/product.actions';
import {Subscription} from 'rxjs';
import * as fromPortfolio from '../store';
import {Error} from '../../../../services/domain/error.model';

@Component({
  templateUrl: './create.component.html'
})
export class ProductCreateComponent implements OnInit, OnDestroy{

  private formStateSubscription: Subscription;

  @ViewChild('form') formComponent: ProductFormComponent;

  private product: Product = {
    identifier: '',
    name: '',
    termRange: {
      temporalUnit: 'MONTHS',
      maximum: 1
    },
    balanceRange: {
      minimum: 1.000,
      maximum: 2.000
    },
    interestRange: {
      minimum: 1.000,
      maximum: 2.000
    },
    interestBasis: 'CURRENT_BALANCE',
    patternPackage: 'io.mifos.portfolio.individuallending.v1',
    description: '',
    accountAssignments: [],
    parameters: '',
    currencyCode: 'USD',
    minorCurrencyUnitDigits: 2,
    enabled: false
  };

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    let productParameters: ProductParameters = {
      maximumDispersalAmount: 0,
      maximumDispersalCount: 0,
      moratoriums: []
    };
    this.product.parameters = JSON.stringify(productParameters);

    this.formStateSubscription = this.portfolioStore.select(fromPortfolio.getProductFormState)
      .filter(payload => !!payload.error)
      .subscribe((payload: {error: Error}) => {
        switch(payload.error.status){
          case 400:
            //This should not happen
            break;
          case 409:
            let detailForm = this.formComponent.detailForm;
            let errors = detailForm.get('identifier').errors || {};
            errors['unique'] = true;
            detailForm.get('identifier').setErrors(errors);
            this.formComponent.step.open();
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
  }

  onSave(product: Product): void {
    this.portfolioStore.dispatch({ type: CREATE, payload: {
      product: product,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
