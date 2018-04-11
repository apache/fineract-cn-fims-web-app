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
import {Component} from '@angular/core';
import {CustomerDocument} from '../../../../services/customer/domain/customer-document.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CasesStore} from '../../store/index';
import {CREATE, CreateDocumentAction} from '../../store/documents/document.actions';
import * as fromCases from '../../store';
import {Observable} from 'rxjs/Observable';
import {CaseSelection} from '../../store/model/case-selection.model';

@Component({
  templateUrl: './create.component.html'
})
export class CaseDocumentCreateComponent {

  currentSelection$: Observable<CaseSelection>;

  document: CustomerDocument = {
    identifier: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore) {
    this.currentSelection$ = casesStore.select(fromCases.getCaseSelection);
  }

  onSave(selection: CaseSelection, document: CustomerDocument) {
    const action = new CreateDocumentAction({
      productId: selection.productId,
      caseId: selection.caseId,
      customerId: selection.customerId,
      document,
      activatedRoute: this.route
    });

    this.casesStore.dispatch(action);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
