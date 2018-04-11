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
import {type} from '../../../../store/util';
import {RoutePayload} from '../../../../common/store/route-payload';
import {CustomerDocument} from '../../../../services/customer/domain/customer-document.model';
import {Action} from '@ngrx/store';
import {
  CreateResourceSuccessPayload, DeleteResourceSuccessPayload, LoadResourcePayload, SelectResourcePayload,
  UpdateResourceSuccessPayload
} from '../../../../common/store/resource.reducer';

export const LOAD_ALL = type('[Case Document] Load All');
export const LOAD_ALL_COMPLETE = type('[Case Document] Load All Complete');

export const LOAD = type('[Case Document] Load');
export const SELECT = type('[Case Document] Select');

export const CREATE = type('[Case Document] Create');
export const CREATE_SUCCESS = type('[Case Document] Create Success');
export const CREATE_FAIL = type('[Case Document] Create Fail');

export const UPDATE = type('[Case Document] Update');
export const UPDATE_SUCCESS = type('[Case Document] Update Success');
export const UPDATE_FAIL = type('[Case Document] Update Fail');

export const DELETE = type('[Case Document] Delete');
export const DELETE_SUCCESS = type('[Case Document] Delete Success');
export const DELETE_FAIL = type('[Case Document] Delete Fail');

export const LOCK = type('[Case Document] Lock');
export const LOCK_SUCCESS = type('[Case Document] Lock Success');
export const LOCK_FAIL = type('[Case Document] Lock Fail');

export const LOAD_ALL_PAGES = type('[Case Document] Load All Pages');
export const LOAD_ALL_PAGES_COMPLETE = type('[Case Document] Load All Pages Complete');

export const UPLOAD_PAGE = type('[Case Document] Upload Page');
export const UPLOAD_PAGE_SUCCESS = type('[Case Document] Upload Page Success');
export const UPLOAD_PAGE_FAIL = type('[Case Document] Upload Page Fail');

export const DELETE_PAGE = type('[Case Document] Delete Page');
export const DELETE_PAGE_SUCCESS = type('[Case Document] Delete Page Success');
export const DELETE_PAGE_FAIL = type('[Case Document] Delete Page Fail');

export const RESET_PAGE_FORM = type('[Case Document] Reset Page Form');

export interface LoadAllPayload {
  customerId: string;
  productId: string;
  caseId: string;
}

export interface LoadAllPagesPayload {
  customerId: string;
  documentId: string;
}

export interface DocumentPayload extends RoutePayload {
  productId: string;
  caseId: string;
  customerId: string;
  document: CustomerDocument;
}

export interface DeletePagePayload {
  customerId: string;
  documentId: string;
  pageNumber: number;
}

export interface UploadPagePayload extends RoutePayload {
  customerId: string;
  documentId: string;
  pageNumber: number;
  page: File;
}

export interface LockPayload {
  customerId: string;
  documentId: string;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: LoadAllPayload) { }
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: CustomerDocument[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: LoadResourcePayload) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: SelectResourcePayload) { }
}

export class CreateDocumentAction implements Action {
  readonly type = CREATE;

  constructor(public payload: DocumentPayload) { }
}

export class CreateDocumentSuccessAction implements Action {
  readonly type = CREATE_SUCCESS;

  constructor(public payload: CreateResourceSuccessPayload) { }
}

export class CreateDocumentFailAction implements Action {
  readonly type = CREATE_FAIL;

  constructor(public payload: Error) { }
}

export class UpdateDocumentAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: DocumentPayload) { }
}

export class UpdateDocumentSuccessAction implements Action {
  readonly type = UPDATE_SUCCESS;

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

export class UpdateDocumentFailAction implements Action {
  readonly type = UPDATE_FAIL;

  constructor(public payload: Error) { }
}

export class DeleteDocumentAction implements Action {
  readonly type = DELETE;

  constructor(public payload: DocumentPayload) { }
}

export class DeleteDocumentSuccessAction implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: DeleteResourceSuccessPayload) { }
}

export class DeleteDocumentFailAction implements Action {
  readonly type = DELETE_FAIL;

  constructor(public payload: Error) { }
}

export class LockDocumentAction implements Action {
  readonly type = LOCK;

  constructor(public payload: LockPayload) { }
}

export class LockDocumentSuccessAction implements Action {
  readonly type = LOCK_SUCCESS;

  constructor(public payload: LockPayload) { }
}

export class LockDocumentFailAction implements Action {
  readonly type = LOCK_FAIL;

  constructor(public payload: Error) { }
}

export class LoadAllPagesAction implements Action {
  readonly type = LOAD_ALL_PAGES;

  constructor(public payload: LoadAllPagesPayload) { }
}

export class LoadAllPagesCompleteAction implements Action {
  readonly type = LOAD_ALL_PAGES_COMPLETE;

  constructor(public payload: number[]) { }
}

export class UploadPageAction implements Action {
  readonly type = UPLOAD_PAGE;

  constructor(public payload: UploadPagePayload) { }
}

export class UploadPageSuccessAction implements Action {
  readonly type = UPLOAD_PAGE_SUCCESS;

  constructor(public payload: UploadPagePayload) { }
}

export class UploadPageFailAction implements Action {
  readonly type = UPLOAD_PAGE_FAIL;

  constructor(public payload: Error) { }
}

export class DeletePageAction implements Action {
  readonly type = DELETE_PAGE;

  constructor(public payload: DeletePagePayload) { }
}

export class DeletePageSuccessAction implements Action {
  readonly type = DELETE_PAGE_SUCCESS;

  constructor(public payload: DeletePagePayload) { }
}

export class DeletePageFailAction implements Action {
  readonly type = DELETE_PAGE_FAIL;

  constructor(public payload: Error) { }
}

export class ResetDocumentPageForm implements Action {
  readonly type = RESET_PAGE_FORM;

  constructor() {}
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | CreateDocumentAction
  | CreateDocumentSuccessAction
  | CreateDocumentFailAction
  | UpdateDocumentAction
  | UpdateDocumentSuccessAction
  | UpdateDocumentFailAction
  | DeleteDocumentAction
  | DeleteDocumentSuccessAction
  | DeleteDocumentFailAction
  | ResetDocumentPageForm
  | LockDocumentAction
  | LockDocumentSuccessAction
  | LockDocumentFailAction
  | LoadAllPagesAction
  | LoadAllPagesCompleteAction
  | UploadPageAction
  | UploadPageSuccessAction
  | UploadPageFailAction
  | DeletePageAction
  | DeletePageSuccessAction
  | DeletePageFailAction;
