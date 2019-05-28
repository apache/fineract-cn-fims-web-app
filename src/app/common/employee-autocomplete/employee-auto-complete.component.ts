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
import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {Observable} from 'rxjs';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Employee} from '../../services/office/domain/employee.model';
import {OfficeService} from '../../services/office/office.service';
import {EmployeePage} from '../../services/office/domain/employee-page.model';
import {map} from 'rxjs/operators';
import { distinctUntilChanged, debounceTime, tap, filter, switchMap } from 'rxjs/operators';

const noop: () => void = () => {
  // empty method
};

@Component({
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EmployeeAutoCompleteComponent), multi: true }
  ],
  selector: 'fims-employee-auto-complete',
  templateUrl: './employee-auto-complete.component.html'
})
export class EmployeeAutoCompleteComponent implements ControlValueAccessor, OnInit {

  private _onTouchedCallback: () => void = noop;

  private _onChangeCallback: (_: any) => void = noop;

  formControl: FormControl;

  @Input() title: string;

  @Input() required: boolean;

  employees: Observable<Employee[]>;

  constructor(private officeService: OfficeService) {}

  ngOnInit(): void {
    this.formControl = new FormControl('');

    this.employees = this.formControl.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(500),
      tap(name => this.changeValue(name)),
      filter(name => name),
      switchMap(name => this.onSearch(name)));
  }

  changeValue(value: string): void {
    this._onChangeCallback(value);
  }

  writeValue(value: any): void {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  onSearch(searchTerm?: string): Observable<Employee[]> {
    const fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 5
      },
      searchTerm
    };

    return this.officeService.listEmployees(fetchRequest).pipe(
      map((employeePage: EmployeePage) => employeePage.employees));
  }

}
