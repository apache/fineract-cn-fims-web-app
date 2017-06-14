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
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Employee} from '../../services/office/domain/employee.model';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {TableData} from '../../common/data-table/data-table.component';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {Observable} from 'rxjs';
import {SEARCH} from '../reducers/employee/employee.actions';

@Component({
  selector: 'fims-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit{

  employeeData$: Observable<TableData>;

  loading$: Observable<boolean>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'givenName', label: 'First Name' },
    { name: 'surname', label: 'Last Name' }
  ];

  searchTerm: string;

  private lastFetchRequest: FetchRequest = {};

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromRoot.State>){}

  ngOnInit(): void {

    this.employeeData$ = this.store.select(fromRoot.getEmployeeSearchResults)
      .map(employeePage => ({
        data: employeePage.employees,
        totalElements: employeePage.totalElements,
        totalPages: employeePage.totalPages
      }));

    this.loading$ = this.store.select(fromRoot.getEmployeeSearchLoading);

    this.route.queryParams.subscribe((params: Params) => {
      this.search(params['term']);
    });
  }

  search(searchTerm: string): void{
    this.searchTerm = searchTerm;
    this.fetchEmployees();
  }

  rowSelect(row: Employee): void{
    this.router.navigate(['detail', row.identifier], { relativeTo: this.route });
  }

  fetchEmployees(fetchRequest?: FetchRequest){
    if(fetchRequest){
      this.lastFetchRequest = fetchRequest;
    }

    this.lastFetchRequest.searchTerm = this.searchTerm;

    this.store.dispatch({ type: SEARCH, payload: this.lastFetchRequest })
  }
}
