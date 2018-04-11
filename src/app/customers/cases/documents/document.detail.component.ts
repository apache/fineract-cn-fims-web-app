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
import {CasesStore} from '../store/index';
import * as fromRoot from '../../../store';
import * as fromCases from '../store';
import {Observable} from 'rxjs/Observable';
import {DeleteDocumentAction, DeletePageAction, LoadAllPagesAction, LockDocumentAction} from '../store/documents/document.actions';
import {TranslateService} from '@ngx-translate/core';
import {TdDialogService} from '@covalent/core';
import {CaseSelection} from '../store/model/case-selection.model';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {CustomerDocument} from '../../../services/customer/domain/customer-document.model';
import {CustomerService} from '../../../services/customer/customer.service';
import {ImageComponent} from '../../../common/image/image.component';
import {FimsPermission} from '../../../services/security/authz/fims-permission.model';

@Component({
  templateUrl: './document.detail.component.html'
})
export class CaseDocumentDetailComponent implements OnInit, OnDestroy {

  private actionsSubscription: Subscription;

  currentSelection$: Observable<CaseSelection>;

  customerDocument$: Observable<CustomerDocument>;

  pageNumbers$: Observable<number[]>;

  canEdit$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private casesStore: CasesStore,
              private translate: TranslateService, private dialogService: TdDialogService, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerDocument$ = this.casesStore.select(fromCases.getSelectedCaseDocument)
      .filter(document => !!document);
    this.currentSelection$ = this.casesStore.select(fromCases.getCaseSelection);
    this.pageNumbers$ = this.casesStore.select(fromCases.getAllDocumentPages);

    this.actionsSubscription = Observable.combineLatest(
      this.customerDocument$,
      this.currentSelection$,
      (document, selection) => ({
        document,
        selection
      })
    ).map(result => new LoadAllPagesAction({
      customerId: result.selection.customerId,
      documentId: result.document.identifier
      })
    ).subscribe(this.casesStore);

    this.canEdit$ = Observable.combineLatest(
      this.casesStore.select(fromRoot.getPermissions),
      this.customerDocument$,
      (permissions, document: CustomerDocument) => ({
        hasPermission: this.hasChangePermission(permissions),
        isLocked: document.completed
      }))
      .map(result => result.hasPermission && !result.isLocked);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  private showTranslatedDialog(title: string, message: string, button: string): Observable<boolean> {
    return this.translate.get([title, message, button])
      .mergeMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  confirmDeletePage(): Observable<boolean> {
    const message = 'Do you want to delete this page?';
    const title = 'Confirm deletion';
    const button = 'DELETE PAGE';

    return this.showTranslatedDialog(title, message, button);
  }

  deletePage(selection: CaseSelection, document: CustomerDocument, pageNumber: number): void {
    this.confirmDeletePage()
      .filter(accept => accept)
      .subscribe(() => {
        const action = new DeletePageAction({
          customerId: selection.customerId,
          documentId: document.identifier,
          pageNumber
        });

        this.casesStore.dispatch(action);
      });
  }

  viewPage(selection: CaseSelection, document: CustomerDocument, pageNumber: number): void {
    this.customerService.getDocumentPage(selection.customerId, document.identifier, pageNumber)
      .subscribe(blob => {
        this.dialogService.open(ImageComponent, {
          data: blob
        });
      });
  }

  confirmDeleteDocument(): Observable<boolean> {
    const message = 'Do you want to delete this document?';
    const title = 'Confirm deletion';
    const button = 'DELETE DOCUMENT';

    return this.showTranslatedDialog(title, message, button);
  }

  deleteDocument(selection: CaseSelection, document: CustomerDocument): void {
    this.confirmDeleteDocument()
      .filter(accept => accept)
      .subscribe(() => {
        const action = new DeleteDocumentAction({
          customerId: selection.customerId,
          productId: selection.productId,
          caseId: selection.caseId,
          document,
          activatedRoute: this.route
        });

        this.casesStore.dispatch(action);
      });
  }

  lock(selection: CaseSelection, document: CustomerDocument): void {
    const action = new LockDocumentAction({
      customerId: selection.customerId,
      documentId: document.identifier
    });

    this.casesStore.dispatch(action);
  }

  private hasChangePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
      permission.id === 'portfolio_documents' &&
      permission.accessLevel === 'CHANGE'
    ).length > 0;
  }

}
