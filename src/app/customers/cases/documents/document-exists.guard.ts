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
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CasesStore} from '../store/index';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {PortfolioService} from '../../../services/portfolio/portfolio.service';
import {Observable} from 'rxjs/Observable';
import * as fromCases from '../store';
import {LoadAction} from '../store/documents/document.actions';
import {of} from 'rxjs/observable/of';
import {CustomerService} from '../../../services/customer/customer.service';
import {CaseCustomerDocuments, Document} from '../../../services/portfolio/domain/case-customer-documents.model';
import {CustomerDocument} from '../../../services/customer/domain/customer-document.model';

@Injectable()
export class DocumentExistsGuard implements CanActivate {

  constructor(private store: CasesStore,
              private customerService: CustomerService,
              private portfolioService: PortfolioService,
              private existsGuardService: ExistsGuardService) {}

  hasDocumentInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromCases.getCaseDocumentLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasDocumentInApi(productId: string, caseId: string, documentId: string): Observable<boolean> {
    const getDocument$ = this.portfolioService.getCaseDocuments(productId, caseId)
      .switchMap((documents: CaseCustomerDocuments) => this.findDocument(documentId, documents.documents))
      .switchMap((document: Document) => this.customerService.getDocument(document.customerId, document.documentId))
      .map((customerDocument: CustomerDocument) => new LoadAction({
        resource: customerDocument
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(document => !!document);

    return this.existsGuardService.routeTo404OnError(getDocument$);
  }

  private findDocument(documentId: string, documents: Document[]): Observable<Document> {
    const foundDocument = documents.find(document => document.documentId === documentId);

    if (!foundDocument) {
      return Observable.throw(new Error('Document not found'));
    }

    return Observable.of(foundDocument);
  }

  hasDocument(productId: string, caseId: string, documentId: string): Observable<boolean> {
    return this.hasDocumentInStore(documentId)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasDocumentInApi(productId, caseId, documentId);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasDocument(route.parent.params['productId'], route.parent.params['caseId'], route.params['documentId']);
  }
}
