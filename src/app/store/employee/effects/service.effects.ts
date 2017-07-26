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
import {OfficeService} from '../../../../services/office/office.service';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as employeeActions from '../employee.actions';
import {emptySearchResult} from '../../../../common/store/search.reducer';

@Injectable()
export class EmployeeSearchApiEffects {

  constructor(private actions$: Actions, private officeService: OfficeService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(employeeActions.SEARCH)
    .debounceTime(300)
    .map((action: employeeActions.SearchAction) => action.payload)
    .switchMap(fetchRequest => {
      const nextSearch$ = this.actions$.ofType(employeeActions.SEARCH).skip(1);

      return this.officeService.listEmployees(fetchRequest)
        .takeUntil(nextSearch$)
        .map(employeePage => new employeeActions.SearchCompleteAction({
          elements: employeePage.employees,
          totalElements: employeePage.totalElements,
          totalPages: employeePage.totalPages
        }))
        .catch(() => of(new employeeActions.SearchCompleteAction(emptySearchResult())));
    });

}
