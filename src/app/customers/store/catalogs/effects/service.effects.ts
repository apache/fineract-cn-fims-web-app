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
import {of} from 'rxjs/observable/of';
import * as catalogActions from '../catalog.actions';
import {CatalogService} from '../../../../services/catalog/catalog.service';

@Injectable()
export class CatalogApiEffects {

  @Effect()
  createCatalog$: Observable<Action> = this.actions$
    .ofType(catalogActions.CREATE)
    .map((action: catalogActions.CreateCatalogAction) => action.payload)
    .mergeMap(payload =>
      this.catalogService.createCatalog(payload.catalog)
        .map(() => new catalogActions.CreateCatalogSuccessAction(payload))
        .catch((error) => of(new catalogActions.CreateCatalogFailAction(error)))
    );

  @Effect()
  deleteCatalog$: Observable<Action> = this.actions$
    .ofType(catalogActions.DELETE)
    .map((action: catalogActions.DeleteCatalogAction) => action.payload)
    .mergeMap(payload =>
      this.catalogService.deleteCatalog(payload.catalog)
        .map(() => new catalogActions.DeleteCatalogSuccessAction(payload))
        .catch((error) => of(new catalogActions.DeleteCatalogFailAction(error)))
    );

  @Effect()
  updateField$: Observable<Action> = this.actions$
    .ofType(catalogActions.UPDATE_FIELD)
    .map((action: catalogActions.UpdateFieldAction) => action.payload)
    .mergeMap(payload =>
      this.catalogService.updateField(payload.catalogIdentifier, payload.field)
        .map(() => new catalogActions.UpdateFieldSuccessAction(payload))
        .catch((error) => of(new catalogActions.UpdateFieldFailAction(error)))
    );

  @Effect()
  deleteField$: Observable<Action> = this.actions$
    .ofType(catalogActions.DELETE_FIELD)
    .map((action: catalogActions.DeleteFieldAction) => action.payload)
    .mergeMap(payload =>
      this.catalogService.deleteField(payload.catalogIdentifier, payload.field)
        .map(() => new catalogActions.DeleteFieldSuccessAction(payload))
        .catch((error) => of(new catalogActions.DeleteFieldFailAction(error)))
    );

  constructor(private actions$: Actions, private catalogService: CatalogService) { }

}
