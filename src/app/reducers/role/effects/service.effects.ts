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

import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as roleActions from '../role.actions';
import {IdentityService} from '../../../../services/identity/identity.service';
import {emptySearchResult} from '../../../../common/store/search.reducer';

@Injectable()
export class RoleSearchApiEffects {

  constructor(private actions$: Actions, private identityService: IdentityService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(roleActions.SEARCH)
    .debounceTime(300)
    .switchMap(() => {
      const nextSearch$ = this.actions$.ofType(roleActions.SEARCH).skip(1);

      return this.identityService.listRoles()
        .takeUntil(nextSearch$)
        .map(roles => new roleActions.SearchCompleteAction({
          elements: roles,
          totalPages: 1,
          totalElements: roles.length
        }))
        .catch(() => of(new roleActions.SearchCompleteAction(emptySearchResult())));
    });

}
