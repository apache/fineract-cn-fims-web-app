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
import {TaskDefinition} from '../../../../../services/portfolio/domain/task-definition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PortfolioStore} from '../../store/index';
import {Subscription} from 'rxjs';
import * as fromPortfolio from '../../store';
import {UPDATE} from '../../store/tasks/task.actions';
import {FimsProduct} from '../../store/model/fims-product.model';

@Component({
  templateUrl: './edit.component.html'
})
export class ProductStatusEditFormComponent implements OnInit, OnDestroy{

  private taskSubscription: Subscription;

  private productSubscription: Subscription;

  private product: FimsProduct;

  task: TaskDefinition;

  constructor(private router: Router, private route: ActivatedRoute, private portfolioStore: PortfolioStore) {}

  ngOnInit(): void {
    this.taskSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProductTask)
      .subscribe(task => this.task = task);

    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .subscribe(product => this.product = product);
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }

  onSave(task: TaskDefinition): void {
    this.portfolioStore.dispatch({ type: UPDATE, payload: {
      productId: this.product.identifier,
      task: task,
      activatedRoute: this.route
    }});
  }

  onCancel(): void{
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
