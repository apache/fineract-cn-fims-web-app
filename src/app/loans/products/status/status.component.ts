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
import {TaskDefinition} from '../../../../services/portfolio/domain/task-definition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TableData, TableFetchRequest} from '../../../../common/data-table/data-table.component';
import {PortfolioStore} from '../store/index';
import {Observable, Subscription} from 'rxjs';
import {SelectAction} from '../store/product.actions';
import * as fromPortfolio from '../store';
import {LOAD_ALL} from '../store/tasks/task.actions';
import {FimsProduct} from '../store/model/fims-product.model';


@Component({
  templateUrl: './status.component.html'
})
export class ProductStatusComponent implements OnInit, OnDestroy{

  private productSubscription: Subscription;

  tasksData$: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' }
  ];

  private product: FimsProduct;

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .subscribe(product => {
        this.product = product;
        this.fetchTasks();
      });

    this.tasksData$ = this.portfolioStore.select(fromPortfolio.getAllProductTaskEntities)
      .map(tasks => ({
        totalElements: tasks.length,
        totalPages: 1,
        data: tasks
      }));

  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  fetchTasks(event?: TableFetchRequest): void {
    this.portfolioStore.dispatch({ type: LOAD_ALL, payload: this.product.identifier });
  }

  rowSelect(taskDefinition: TaskDefinition): void {
    this.router.navigate(['detail', taskDefinition.identifier], { relativeTo: this.route })
  }
}
