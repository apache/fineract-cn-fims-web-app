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
import {ActivatedRoute} from '@angular/router';
import {TaskDefinition} from '../../../../services/portfolio/domain/task-definition.model';
import {SelectAction} from '../store/tasks/task.actions';
import {PortfolioStore} from '../store/index';
import {Subscription} from 'rxjs';
import * as fromPortfolio from '../store';

@Component({
  templateUrl: './status.detail.component.html'
})
export class ProductStatusDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private taskSubscription: Subscription;

  task: TaskDefinition;

  constructor(private route: ActivatedRoute, private portfolioStore: PortfolioStore){}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
    .map(params => new SelectAction(params['taskId']))
    .subscribe(this.portfolioStore);

    this.taskSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProductTask)
      .subscribe(task => this.task = task);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.taskSubscription.unsubscribe();
  }
}
