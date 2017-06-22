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
import {ProductDefinition} from '../../../services/depositAccount/domain/definition/product-definition.model';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {DepositAccountStore} from '../store/index';
import * as fromDepositAccounts from './../store';
import {TableData} from '../../../common/data-table/data-table.component';
import {TdDialogService} from '@covalent/core';
import {Observable} from 'rxjs/Observable';
import {DELETE} from '../store/product.actions';

@Component({
  templateUrl: './deposit-product.detail.component.html'
})
export class DepositProductDetailComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  definition: ProductDefinition;

  charges: TableData;

  columns: any[] = [
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' },
    { name: 'actionIdentifier', label: 'Applied on' },
    { name: 'proportional', label: 'Proportional?' },
    { name: 'amount', label: 'Amount' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: DepositAccountStore, private dialogService: TdDialogService) {}

  ngOnInit(): void {
    this.productSubscription = this.store.select(fromDepositAccounts.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => {
        this.definition = product;
        this.charges = {
          data: product.charges,
          totalElements: product.charges.length,
          totalPages: 1
        }
      });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  goToTasks(): void {
    this.router.navigate(['tasks'], { relativeTo: this.route })
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to delete this product?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE PRODUCT',
    }).afterClosed();
  }

  deleteProduct(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => this.store.dispatch({
        type: DELETE, payload: {
          productDefinition: this.definition,
          activatedRoute: this.route
        }
      }));
  }
}
