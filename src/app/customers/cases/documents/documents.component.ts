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
import {Observable} from 'rxjs/Observable';
import {TableData} from '../../../common/data-table/data-table.component';
import {CasesStore} from '../store/index';
import * as fromCases from '../store';
import {LoadAllAction} from '../store/documents/document.actions';
import {CaseSelection} from '../store/model/case-selection.model';
import {Subscription} from 'rxjs/Subscription';
import {CustomerDocument} from '../../../services/customer/domain/customer-document.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: './documents.component.html',
  providers: [DatePipe]
})
export class CaseDocumentComponent implements OnInit, OnDestroy {

  private actionsSubscription: Subscription;

  currentSelection$: Observable<CaseSelection>;

  documentData$: Observable<TableData>;

  columns: any[] = [
    { name: 'description', label: 'Description' },
    { name: 'createdBy', label: 'Created by' },
    { name: 'createdOn', label: 'Created on', format: value => this.datePipe.transform(value, 'short') }
  ];

  constructor(private casesStore: CasesStore, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.currentSelection$ = casesStore.select(fromCases.getCaseSelection);

    this.documentData$ = casesStore.select(fromCases.getAllCaseDocumentEntities)
      .map(entities => ({
        data: entities,
        totalElements: entities.length,
        totalPages: 1
      }))
  }

  ngOnInit(): void {
    this.actionsSubscription = this.currentSelection$
      .map(selection => new LoadAllAction({
        customerId: selection.customerId,
        productId: selection.productId,
        caseId: selection.caseId
      }))
      .subscribe(this.casesStore);
  }

  ngOnDestroy(): void {
    if (this.actionsSubscription) {
      this.actionsSubscription.unsubscribe();
    }
  }

  rowSelect(document: CustomerDocument): void {
    this.router.navigate(['detail', document.identifier], { relativeTo: this.route });
  }
}
