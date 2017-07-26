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
import {Actions, Effect} from '@ngrx/effects';
import {CountryService} from '../../../services/country/country.service';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as countryActions from './country.actions';
import {emptySearchResult} from '../../../common/store/search.reducer';
import {of} from 'rxjs/observable/of';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';

@Injectable()
export class CountrySearchApiEffects {

  constructor(private actions$: Actions, private countryService: CountryService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(countryActions.SEARCH)
    .debounceTime(300)
    .map((action: countryActions.SearchAction) => action.payload)
    .switchMap((fetchRequest: FetchRequest) => {
      const nextSearch$ = this.actions$.ofType(countryActions.SEARCH).skip(1);

      return Observable.of(this.countryService.fetchCountries(fetchRequest.searchTerm))
        .takeUntil(nextSearch$)
        .map(countries => new countryActions.SearchCompleteAction({
          elements: countries,
          totalElements: countries.length,
          totalPages: 1
        }))
        .catch(() => of(new countryActions.SearchCompleteAction(emptySearchResult())));
    });

}
