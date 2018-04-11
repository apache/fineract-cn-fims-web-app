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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as documents from '../document.actions';
import {DeletePagePayload, DocumentPayload, LoadAllPagesPayload, LoadAllPayload, LockPayload, UploadPagePayload} from '../document.actions';
import {of} from 'rxjs/observable/of';
import {DocumentsService} from './services/documents.service';

@Injectable()
export class CaseDocumentApiEffects {

  @Effect()
  loadAllDocuments$: Observable<Action> = this.actions$
    .ofType(documents.LOAD_ALL)
    .map((action: documents.LoadAllAction) => action.payload)
    .switchMap((payload: LoadAllPayload) =>
      this.documentsService.getCustomerDocuments(payload.customerId, payload.productId, payload.caseId)
        .map(customerDocuments => new documents.LoadAllCompleteAction(customerDocuments))
        .catch(() => of(new documents.LoadAllCompleteAction([])))
    );

  @Effect()
  createDocument$: Observable<Action> = this.actions$
    .ofType(documents.CREATE)
    .map((action: documents.CreateDocumentAction) => action.payload)
    .mergeMap((payload: DocumentPayload) =>
      this.documentsService.createDocument(payload.productId, payload.caseId, payload.customerId, payload.document)
        .map(() => new documents.CreateDocumentSuccessAction({
          resource: payload.document,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new documents.CreateDocumentFailAction(error)))
    );

  @Effect()
  updateDocument$: Observable<Action> = this.actions$
    .ofType(documents.UPDATE)
    .map((action: documents.UpdateDocumentAction) => action.payload)
    .mergeMap((payload: DocumentPayload) =>
      this.documentsService.updateDocument(payload.customerId, payload.document)
        .map(() => new documents.UpdateDocumentSuccessAction({
          resource: payload.document,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new documents.UpdateDocumentFailAction(error)))
    );

  @Effect()
  deleteDocument$: Observable<Action> = this.actions$
    .ofType(documents.DELETE)
    .map((action: documents.DeleteDocumentAction) => action.payload)
    .mergeMap((payload: DocumentPayload) =>
      this.documentsService.deleteDocument(payload.productId, payload.caseId, payload.customerId, payload.document)
        .map(() => new documents.DeleteDocumentSuccessAction({
          resource: payload.document,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new documents.DeleteDocumentFailAction(error)))
    );

  @Effect()
  lockDocument$: Observable<Action> = this.actions$
    .ofType(documents.LOCK)
    .map((action: documents.LockDocumentAction) => action.payload)
    .mergeMap((payload: LockPayload) =>
      this.documentsService.lockDocument(payload.customerId, payload.documentId)
        .map(() => new documents.LockDocumentSuccessAction(payload))
        .catch((error) => of(new documents.LockDocumentFailAction(error)))
    );

  @Effect()
  loadAllPages$: Observable<Action> = this.actions$
    .ofType(documents.LOAD_ALL_PAGES)
    .map((action: documents.LoadAllPagesAction) => action.payload)
    .switchMap((payload: LoadAllPagesPayload) =>
      this.documentsService.getDocumentPageNumbers(payload.customerId, payload.documentId)
        .map(pageNumbers => new documents.LoadAllPagesCompleteAction(pageNumbers))
        .catch(() => of(new documents.LoadAllPagesCompleteAction([])))
    );

  @Effect()
  uploadDocumentPage$: Observable<Action> = this.actions$
    .ofType(documents.UPLOAD_PAGE)
    .map((action: documents.UploadPageAction) => action.payload)
    .mergeMap((payload: UploadPagePayload) =>
      this.documentsService.uploadPage(payload.customerId, payload.documentId, payload.pageNumber, payload.page)
        .map(() => new documents.UploadPageSuccessAction(payload))
        .catch((error) => of(new documents.UploadPageFailAction(error)))
    );

  @Effect()
  deleteDocumentPage$: Observable<Action> = this.actions$
    .ofType(documents.DELETE_PAGE)
    .map((action: documents.DeletePageAction) => action.payload)
    .mergeMap((payload: DeletePagePayload) =>
      this.documentsService.deletePage(payload.customerId, payload.documentId, payload.pageNumber)
        .map(() => new documents.DeletePageSuccessAction(payload))
        .catch((error) => of(new documents.DeletePageFailAction(error)))
    );

  constructor(private actions$: Actions, private documentsService: DocumentsService) {}

}
