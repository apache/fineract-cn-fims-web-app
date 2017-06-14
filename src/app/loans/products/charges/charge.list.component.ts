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
import {ActivatedRoute, Router} from '@angular/router';
import {TableData, TableFetchRequest} from '../../../../common/data-table/data-table.component';
import {ChargeDefinition} from '../../../../services/portfolio/domain/charge-definition.model';
import {ITdDataTableColumn} from '@covalent/core';
import {ActionOption, ActionOptions} from '../../../../common/domain/action-option.model';
import {PortfolioStore} from '../store/index';
import * as fromPortfolio from '../store';
import {Observable, Subscription} from 'rxjs';
import {LOAD_ALL} from '../store/charges/charge.actions';
import {FimsProduct} from '../store/model/fims-product.model';

@Component({
  templateUrl: './charge.list.component.html'
})
export class ProductChargeListComponent implements OnInit, OnDestroy{

  private productSubscription: Subscription;

  private product: FimsProduct;

  chargesData$: Observable<TableData>;

  columns: ITdDataTableColumn[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'amount', label: 'Amount', numeric: true, format: value => value.toFixed(2) },
    { name: 'chargeAction', label: 'Applied when', format: value => {
      let result: ActionOption = ActionOptions.find((option) => {
        return option.type === value
      });
      return result.label;
    } }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .subscribe(product => {
        this.product = product;
        this.fetchCharges();
      });

    this.chargesData$ = this.portfolioStore.select(fromPortfolio.getAllProductChargeEntities)
      .map(charges => ({
        totalElements: charges.length,
        totalPages: 1,
        data: charges
      }));
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  fetchCharges(event?: TableFetchRequest): void {
    this.portfolioStore.dispatch({ type: LOAD_ALL, payload: this.product.identifier });
  }

  rowSelect(chargeDefinition: ChargeDefinition): void {
    this.router.navigate(['detail', chargeDefinition.identifier], { relativeTo: this.route })
  }
}
