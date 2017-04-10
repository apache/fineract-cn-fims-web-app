/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {Action} from "@ngrx/store";
import {of} from "rxjs/observable/of";
import * as catalogActions from "../catalog.actions";
import {CatalogService} from "../../../../../services/catalog/catalog.service";

@Injectable()
export class CatalogApiEffects {

  constructor(private actions$: Actions, private catalogService: CatalogService) { }

  @Effect()
  loadCatalogs$: Observable<Action> = this.actions$
    .ofType(catalogActions.LOAD_ALL)
    .mergeMap(() =>
      this.catalogService.fetchCatalogs()
        .map(catalogs => new catalogActions.LoadAllCompleteAction(catalogs))
        .catch((error) => of(new catalogActions.LoadAllCompleteAction([])))
    );

}
