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
import {PortfolioService} from '../../../../../../services/portfolio/portfolio.service';
import {CustomerService} from '../../../../../../services/customer/customer.service';
import {Observable} from 'rxjs/Observable';
import {CustomerDocument} from '../../../../../../services/customer/domain/customer-document.model';
import {CaseCustomerDocuments} from '../../../../../../services/portfolio/domain/case-customer-documents.model';

@Injectable()
export class DocumentsService {

  constructor(private customerService: CustomerService, private portfolioService: PortfolioService) {
  }

  public createDocument(productId: string, caseId: string, customerId: string, customerDocument: CustomerDocument): Observable<void> {
    return this.getNextDocumentId(customerId, caseId)
      .map((nextId: string) => Object.assign({}, customerDocument, {identifier: nextId}))
      .mergeMap((document: CustomerDocument) => this.customerService.createDocument(customerId, document)
        .mergeMap(() => this.portfolioService.getCaseDocuments(productId, caseId))
        .map((documents: CaseCustomerDocuments) => this.addDocument(documents, customerId, document.identifier))
        .mergeMap((documents: CaseCustomerDocuments) => this.portfolioService.changeCaseDocuments(productId, caseId, documents))
      )
  }

  /**
   * Fetches the next available document identifier from the customer service.
   * The document identifier follows the pattern 'caseId_increment' e.g. 'myCase_12'
   */
  private getNextDocumentId(customerId: string, caseId: string): Observable<string> {
    return this.customerService.getDocuments(customerId)
      .map((documents: CustomerDocument[]) => documents.filter(document => document.identifier.startsWith(caseId)))
      .map((documents: CustomerDocument[]) => documents.map(document =>
        document.identifier.substr(caseId.length + 1, document.identifier.length))
      )
      .map((documentIds: string[]) => documentIds.map(id => parseInt(id, 10)))
      .map((documentIds: number[]) => documentIds.length > 0 ? Math.max(...documentIds) + 1 : 1)
      .map((nextId: number) => `${caseId}_${nextId}`);
  }

  public getCustomerDocuments(customerId: string, productId: string, caseId: string): Observable<CustomerDocument[]> {
    return Observable.combineLatest(
      this.portfolioService.getCaseDocuments(productId, caseId),
      this.customerService.getDocuments(customerId),
      (caseDocuments, customerDocuments) => ({
        caseDocuments: caseDocuments.documents,
        customerDocuments
      })
    ).map(result => result.customerDocuments.filter(document => {
        const foundCaseDocument = result.caseDocuments.find(caseDocument => caseDocument.documentId === document.identifier);
        return !!foundCaseDocument;
      })
    );
  }

  private addDocument(documents: CaseCustomerDocuments, customerId: string, documentId: string): CaseCustomerDocuments {
    return Object.assign({}, documents, {
      documents: documents.documents.concat({
        customerId,
        documentId
      })
    })
  }

  public updateDocument(customerId: string, customerDocument: CustomerDocument): Observable<void> {
    return this.customerService.updateDocument(customerId, customerDocument);
  }

  public deleteDocument(productId: string, caseId: string, customerId: string, customerDocument: CustomerDocument): Observable<void> {
    return this.customerService.deleteDocument(customerId, customerDocument)
      .mergeMap(() => this.portfolioService.getCaseDocuments(productId, caseId))
      .map((documents: CaseCustomerDocuments) => this.removeDocument(documents, customerDocument.identifier))
      .mergeMap((documents: CaseCustomerDocuments) => this.portfolioService.changeCaseDocuments(productId, caseId, documents))
  }

  private removeDocument(documents: CaseCustomerDocuments, documentId: string): CaseCustomerDocuments {
    return Object.assign({}, documents, {
      documents: documents.documents.filter(document => document.documentId !== documentId)
    })
  }

  public getDocumentPageNumbers(customerId: string, documentId: string): Observable<number[]> {
    return this.customerService.getDocumentPageNumbers(customerId, documentId);
  }

  public uploadPage(customerId: string, documentId: string, pageNumber: number, file: File): Observable<void> {
    return this.customerService.createDocumentPage(customerId, documentId, pageNumber, file);
  }

  public deletePage(customerId: string, documentId: string, pageNumber: number): Observable<void> {
    return this.customerService.deleteDocumentPage(customerId, documentId, pageNumber);
  }

  public lockDocument(customerId: string, documentId: string): Observable<void> {
    return this.customerService.completeDocument(customerId, documentId, true);
  }


}
