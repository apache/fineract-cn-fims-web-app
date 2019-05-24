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
import { Injectable } from '@angular/core';
import { Actions, Effect,ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as catalogActions from '../catalog.actions';
import { CatalogService } from '../../../../services/catalog/catalog.service';
import { map, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class CatalogApiEffects {

  @Effect()
  createCatalog$: Observable<Action> = this.actions$
    .pipe(ofType(catalogActions.CREATE),
      map((action: catalogActions.CreateCatalogAction) => action.payload),
      mergeMap(payload =>
        this.catalogService.createCatalog(payload.catalog).pipe(
          map(() => new catalogActions.CreateCatalogSuccessAction(payload)),
          catchError((error) => of(new catalogActions.CreateCatalogFailAction(error))))
      ));

  @Effect()
  deleteCatalog$: Observable<Action> = this.actions$
    .pipe(ofType(catalogActions.DELETE),
      map((action: catalogActions.DeleteCatalogAction) => action.payload),
      mergeMap(payload =>
        this.catalogService.deleteCatalog(payload.catalog).pipe(
          map(() => new catalogActions.DeleteCatalogSuccessAction(payload)),
          catchError((error) => of(new catalogActions.DeleteCatalogFailAction(error))))
      ));

  @Effect()
  updateField$: Observable<Action> = this.actions$
    .pipe(ofType(catalogActions.UPDATE_FIELD),
      map((action: catalogActions.UpdateFieldAction) => action.payload),
      mergeMap(payload =>
        this.catalogService.updateField(payload.catalogIdentifier, payload.field).pipe(
          map(() => new catalogActions.UpdateFieldSuccessAction(payload)),
          catchError((error) => of(new catalogActions.UpdateFieldFailAction(error))))
      ));

  @Effect()
  deleteField$: Observable<Action> = this.actions$
    .pipe(ofType(catalogActions.DELETE_FIELD),
      map((action: catalogActions.DeleteFieldAction) => action.payload),
      mergeMap(payload =>
        this.catalogService.deleteField(payload.catalogIdentifier, payload.field).pipe(
          map(() => new catalogActions.DeleteFieldSuccessAction(payload)),
          catchError((error) => of(new catalogActions.DeleteFieldFailAction(error))))
      ));

  constructor(private actions$: Actions, private catalogService: CatalogService) { }

}
