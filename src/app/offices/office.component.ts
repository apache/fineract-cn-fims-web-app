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
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {TableData} from '../../common/data-table/data-table.component';
import {Office} from '../../services/office/domain/office.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as fromOffice from './store';

import {Observable} from 'rxjs';
import {SEARCH} from '../reducers/office/office.actions';
import {OfficesStore} from './store/index';

@Component({
  selector: 'fims-office',
  templateUrl: './office.component.html'
})
export class OfficeComponent implements OnInit {

  officeData$: Observable<TableData>;

  loading$: Observable<boolean>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' }
  ];

  searchTerm: string;

  private lastFetchRequest: FetchRequest = {};

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.search(params['term']);
    });
    this.officeData$ = this.store.select(fromRoot.getOfficeSearchResults)
      .map(officePage => ({
        data: officePage.offices,
        totalElements: officePage.totalElements,
        totalPages: officePage.totalPages
      }));

    this.loading$ = this.store.select(fromRoot.getOfficeSearchLoading);
  }

  rowSelect(office: Office): void{
    this.router.navigate(['detail', office.identifier], { relativeTo: this.route });
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.fetchOffices();
  }

  fetchOffices(fetchRequest?: FetchRequest): void {
    if(fetchRequest){
      this.lastFetchRequest = fetchRequest;
    }

    this.lastFetchRequest.searchTerm = this.searchTerm;

    this.store.dispatch({ type: SEARCH, payload: this.lastFetchRequest});
  }
}
