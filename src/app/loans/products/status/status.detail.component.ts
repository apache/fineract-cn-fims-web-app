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
import {ActivatedRoute} from '@angular/router';
import {TaskDefinition} from '../../../services/portfolio/domain/task-definition.model';
import {DELETE, SelectAction} from '../store/tasks/task.actions';
import {PortfolioStore} from '../store/index';
import {Subscription} from 'rxjs/Subscription';
import * as fromPortfolio from '../store';
import {Observable} from 'rxjs/Observable';
import {TdDialogService} from '@covalent/core';
import {Product} from '../../../services/portfolio/domain/product.model';
import {FimsProduct} from '../store/model/fims-product.model';

@Component({
  templateUrl: './status.detail.component.html'
})
export class ProductStatusDetailComponent implements OnInit, OnDestroy {

  private actionsSubscription: Subscription;

  task$: Observable<TaskDefinition>;

  product$: Observable<FimsProduct>;

  constructor(private route: ActivatedRoute, private portfolioStore: PortfolioStore, private dialogService: TdDialogService) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
    .map(params => new SelectAction(params['taskId']))
    .subscribe(this.portfolioStore);

    this.task$ = this.portfolioStore.select(fromPortfolio.getSelectedProductTask);
    this.product$ = this.portfolioStore.select(fromPortfolio.getSelectedProduct);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to delete this task?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE TASK',
    }).afterClosed();
  }

  deleteTask(product: Product, task: TaskDefinition): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.portfolioStore.dispatch({ type: DELETE, payload: {
          productId: product.identifier,
          task,
          activatedRoute: this.route
        } });
      });
  }
}
