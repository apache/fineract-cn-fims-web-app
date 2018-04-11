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

import {Component, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UploadPageFormData} from './upload-page.form.component';
import {UploadPageAction} from '../../../store/documents/document.actions';
import {CasesStore} from '../../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {CaseSelection} from '../../../store/model/case-selection.model';
import * as fromCases from '../../../store';
import {CustomerDocument} from '../../../../../services/customer/domain/customer-document.model';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateDocumentPageComponent implements OnDestroy {

  private actionsSubscription: Subscription;

  private currentSelection$: Observable<CaseSelection>;

  private document$: Observable<CustomerDocument>;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore) {
    this.currentSelection$ = casesStore.select(fromCases.getCaseSelection);
    this.document$ = casesStore.select(fromCases.getSelectedCaseDocument);
  }

  ngOnDestroy(): void {
    if (this.actionsSubscription) {
      this.actionsSubscription.unsubscribe();
    }
  }

  onSave(formData: UploadPageFormData): void {
    this.actionsSubscription = Observable.combineLatest(
      this.currentSelection$,
      this.document$,
      (selection, document) => ({
        selection,
        document
      })
    ).map(result => new UploadPageAction({
        customerId: result.selection.customerId,
        documentId: result.document.identifier,
        page: formData.file,
        pageNumber: formData.pageNumber,
        activatedRoute: this.route
      })
    ).subscribe(this.casesStore);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
