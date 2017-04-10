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
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Employee} from '../../../../services/office/domain/employee.model';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import * as fromRoot from '../../../reducers';
import {SEARCH} from '../../../reducers/employee/employee.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'fims-customer-employees-form',
  templateUrl: './employees.component.html'
})
export class CustomerEmployeesComponent implements OnInit {

  employees: Observable<Employee[]>;

  @Input() preSelection: string[];

  @Output() onSelectionChange = new EventEmitter<string[]>();

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.employees = this.store.select(fromRoot.getEmployeeSearchResults)
      .map(employeePage => employeePage.employees)
  }

  search(term){
    let fetchRequest: FetchRequest = {
      searchTerm: term
    };
    this.store.dispatch({ type: SEARCH, payload: fetchRequest });
  }

  selectionChange(selections: string[]): void{
    this.onSelectionChange.emit(selections);
  }

}
