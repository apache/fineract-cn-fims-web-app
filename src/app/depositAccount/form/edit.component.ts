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
import {ActivatedRoute, Router} from '@angular/router';
import {DepositAccountStore} from '../store/index';
import {CREATE, RESET_FORM, UPDATE} from '../store/product.actions';
import {Subscription} from 'rxjs';
import * as fromDepositAccount from '../store';
import {Error} from '../../../services/domain/error.model';
import {ProductDefinition} from '../../../services/depositAccount/domain/definition/product-definition.model';
import {DepositProductFormComponent} from './form.component';
import {CurrencyService} from '../../../services/currency/currency.service';
import {DepositAccountService} from '../../../services/depositAccount/deposit-account.service';
import {Currency} from '../../../services/currency/domain/currency.model';
import {Action} from '../../../services/depositAccount/domain/definition/action.model';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './edit.component.html'
})
export class DepositProductEditComponent implements OnInit, OnDestroy{

  @ViewChild('form') formComponent: DepositProductFormComponent;

  definition$: Observable<ProductDefinition>;

  currencies: Observable<Currency[]>;

  actions: Observable<Action[]>;

  constructor(private router: Router, private route: ActivatedRoute, private depositStore: DepositAccountStore,
              private depositService: DepositAccountService, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencies = this.currencyService.fetchCurrencies();
    this.actions = this.depositService.fetchActions();
    this.definition$ = this.depositStore.select(fromDepositAccount.getSelectedProduct);
  }

  ngOnDestroy(): void {
    this.depositStore.dispatch({ type: RESET_FORM })
  }

  onSave(productDefinition: ProductDefinition): void {
    this.depositStore.dispatch({ type: UPDATE, payload: {
      productDefinition,
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
