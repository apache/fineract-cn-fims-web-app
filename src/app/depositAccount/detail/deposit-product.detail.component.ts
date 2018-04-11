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
import {ProductDefinition} from '../../services/depositAccount/domain/definition/product-definition.model';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {DepositAccountStore} from '../store/index';
import * as fromDepositAccounts from './../store';
import * as fromRoot from '../../store';
import {TableData} from '../../common/data-table/data-table.component';
import {TdDialogService} from '@covalent/core';
import {Observable} from 'rxjs/Observable';
import {DELETE, EXECUTE_COMMAND} from '../store/product.actions';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';

@Component({
  templateUrl: './deposit-product.detail.component.html'
})
export class DepositProductDetailComponent implements OnInit, OnDestroy {

  private productSubscription: Subscription;

  numberFormat = '1.2-2';

  definition: ProductDefinition;

  canDistributeDividends$: Observable<boolean>;

  charges: TableData;

  columns: any[] = [
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' },
    { name: 'actionIdentifier', label: 'Applied on' },
    { name: 'proportional', label: 'Proportional?' },
    { name: 'incomeAccountIdentifier', label: 'Income account' },
    { name: 'amount', label: 'Amount', numeric: true, format: value => value ? value.toFixed(2) : undefined }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: DepositAccountStore,
              private dialogService: TdDialogService) {}

  ngOnInit(): void {
    const selectedProduct$ = this.store.select(fromDepositAccounts.getSelectedProduct)
      .filter(product => !!product);

    this.productSubscription = selectedProduct$
      .subscribe(product => {
        this.definition = product;
        this.charges = {
          data: product.charges,
          totalElements: product.charges.length,
          totalPages: 1
        };
      });

    this.canDistributeDividends$ = Observable.combineLatest(
      selectedProduct$,
      this.store.select(fromRoot.getPermissions),
      (product, permissions) => ({
        isShareProduct: product.type === 'SHARE',
        hasPermission: this.hasChangePermission(permissions)
      })
    ).map(result => result.isShareProduct && result.hasPermission);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  goToTasks(): void {
    this.router.navigate(['tasks'], { relativeTo: this.route });
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

  hasTerm(defininition: ProductDefinition): boolean {
    return !!defininition.term.timeUnit || !!defininition.term.period;
  }

  private hasChangePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
      permission.id === 'deposit_definitions' &&
      permission.accessLevel === 'CHANGE'
    ).length > 0;
  }

  enableProduct(): void {
    this.store.dispatch({ type: EXECUTE_COMMAND, payload: {
      definitionId: this.definition.identifier,
      command: {
        action: 'ACTIVATE'
      }
    }});
  }

  disableProduct(): void {
    this.store.dispatch({ type: EXECUTE_COMMAND, payload: {
      definitionId: this.definition.identifier,
      command: {
        action: 'DEACTIVATE'
      }
    }});
  }
}
