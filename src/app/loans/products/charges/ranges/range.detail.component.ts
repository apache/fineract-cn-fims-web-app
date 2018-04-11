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
import {Component, OnInit} from '@angular/core';
import {PortfolioStore} from '../../store/index';
import * as fromPortfolio from '../../store';
import {Observable} from 'rxjs/Observable';
import {RangeActions} from '../../store/ranges/range.actions';
import {ActivatedRoute} from '@angular/router';
import {ITdDataTableColumn, TdDialogService} from '@covalent/core';
import {FimsProduct} from '../../store/model/fims-product.model';
import {Subscription} from 'rxjs/Subscription';
import {FimsRange} from '../../../../services/portfolio/domain/range-model';

@Component({
  templateUrl: './range.detail.component.html'
})
export class ProductChargeRangeDetailComponent implements OnInit {

  private productSubscription: Subscription;

  private product: FimsProduct;

  range$: Observable<FimsRange>;

  rangeColumns: ITdDataTableColumn[] = [
    { name: 'identifier', label: 'Identifier' },
    { name: 'start', label: 'Start', numeric: true, format: value => value ? value.toFixed(2) : '-' },
    { name: 'end', label: 'End', numeric: true, format: value => value ? value.toFixed(2) : '-' },
  ];

  constructor(private portfolioStore: PortfolioStore, private route: ActivatedRoute, private dialogService: TdDialogService) {}

  ngOnInit(): void {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => this.product = product);

    this.range$ = this.portfolioStore.select(fromPortfolio.getSelectedProductChargeRange)
      .filter(range => !!range);
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to this range?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE RANGE',
    }).afterClosed();
  }

  deleteRange(resource: FimsRange): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.portfolioStore.dispatch(RangeActions.deleteAction({
          resource,
          data: {
            productIdentifier: this.product.identifier,
            activatedRoute: this.route
          }
        }));
      });
  }
}
