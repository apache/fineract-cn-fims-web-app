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
import {TableData, TableFetchRequest} from '../../../../common/data-table/data-table.component';
import {Router} from '@angular/router';
import {TaskDefinition} from '../../../../services/portfolio/domain/task-definition.model';
import {Case} from '../../../../services/portfolio/domain/case.model';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import {Observable, Subscription} from 'rxjs';
import {LOAD_ALL} from '../store/tasks/task.actions';
import {FimsCase} from '../store/model/fims-case.model';

@Component({
  templateUrl: './task.component.html'
})
export class CaseTasksComponent implements OnInit, OnDestroy{

  private caseSubscription: Subscription;

  caseInstance: FimsCase;

  tasksData$: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' }
  ];

  constructor(private router: Router, private casesStore: CasesStore) {}

  ngOnInit(): void {
    this.caseSubscription = this.casesStore.select(fromCases.getSelectedCase)
      .subscribe(caseInstance => {
        this.caseInstance = caseInstance;
        this.fetchTasks();
      });

    this.tasksData$ = this.casesStore.select(fromCases.getCaseTasksEntities)
      .map(taskEntities => ({
        data: taskEntities,
        totalElements: taskEntities.length,
        totalPages: 1
      }));
  }

  ngOnDestroy(): void {
    this.caseSubscription.unsubscribe();
  }

  rowSelect(task: TaskDefinition): void{
    this.router.navigate(['tasks', task.identifier]);
  }

  fetchTasks(event?: TableFetchRequest): void{
    this.casesStore.dispatch({ type: LOAD_ALL, payload: {
      caseId: this.caseInstance.identifier,
      productId: this.caseInstance.productIdentifier
    }});
  }
}
