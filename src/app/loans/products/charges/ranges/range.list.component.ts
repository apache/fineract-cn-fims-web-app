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
import {ITdDataTableColumn} from '@covalent/core';
import {TableData, TableFetchRequest} from '../../../../common/data-table/data-table.component';
import {Observable} from 'rxjs/Observable';
import {PortfolioStore} from '../../store/index';
import {RangeActions} from '../../store/ranges/range.actions';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromPortfolio from '../../store';
import {FimsRange} from '../../../../services/portfolio/domain/range-model';
import {Subscription} from 'rxjs/Subscription';
import {FimsProduct} from '../../store/model/fims-product.model';

@Component({
  templateUrl: './range.list.component.html'
})
export class ProductChargeRangeListComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  private product: FimsProduct;

  rangesData$: Observable<TableData>;

  columns: ITdDataTableColumn[] = [
    { name: 'identifier', label: 'Id' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.rangesData$ = this.portfolioStore.select(fromPortfolio.getAllProductChargeRangeEntities)
      .map(data => ({
        totalElements: data.length,
        totalPages: 1,
        data
      }));

    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => {
        this.product = product;
        this.fetchRanges();
      });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  fetchRanges(event?: TableFetchRequest): void {
    this.portfolioStore.dispatch(RangeActions.loadAllAction(this.product.identifier));
  }

  rowSelect(range: FimsRange): void {
    this.router.navigate(['detail', range.identifier], { relativeTo: this.route });
  }
}
