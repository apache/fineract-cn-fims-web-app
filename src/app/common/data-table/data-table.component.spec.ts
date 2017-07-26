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

import {Component, DebugElement, EventEmitter, ViewChild} from '@angular/core';
import {DataTableComponent, TableData, TableFetchRequest} from './data-table.component';
import {
  CovalentDataTableModule, CovalentPagingModule, ITdDataTableColumn,
  TdDataTableColumnComponent, TdDataTableComponent, TdDataTableSortingOrder
} from '@covalent/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdIconModule} from '@angular/material';

describe('Test data table component', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  let columns: DebugElement[];

  function click(element: DebugElement) {
    element.triggerEventHandler('click', new Event('click'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DataTableComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        MdIconModule,
        CovalentDataTableModule,
        CovalentPagingModule
      ]

    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();

    columns = fixture.debugElement.queryAll(By.directive(TdDataTableColumnComponent));
  });

  it('should render 2 columns', () => {
    expect(columns.length).toEqual(2);
  });

  it('should sort ascending', fakeAsync(() => {
    const expectedResult: TableFetchRequest = {
      sort: { sortDirection: 'DESC', sortColumn: 'identifier' },
      page: { pageIndex: 0, size: 10 }
    };

    let result: TableFetchRequest;

    testComponent.fetchRequestEmitter.subscribe(fetchRequest => result = fetchRequest);

    // TODO figure out why click does not come through
    // click(columns[0]);

    testComponent.dataTableComponent.sortChanged({
      order: TdDataTableSortingOrder.Ascending,
      name: 'identifier'
    });

    fixture.detectChanges();

    tick();

    expect(result).toEqual(expectedResult);
  }));

  it('should sort descending', fakeAsync(() => {
    const expectedResult: TableFetchRequest = {
      sort: { sortDirection: 'ASC', sortColumn: 'name' },
      page: { pageIndex: 0, size: 10 }
    };

    let result: TableFetchRequest;

    testComponent.fetchRequestEmitter.subscribe(fetchRequest => result = fetchRequest);

    // TODO figure out why click does not come through
    // click(columns[0]);

    testComponent.dataTableComponent.sortChanged({
      order: TdDataTableSortingOrder.Descending,
      name: 'name'
    });

    fixture.detectChanges();

    tick();

    expect(result).toEqual(expectedResult);
  }));

});

@Component({
  template: '<fims-data-table #datatable [data]="tableData" [columns]="columns" (onFetch)="onFetch($event)" [sortable]="true" [actionColumn]="false"></fims-data-table>'
})
class TestComponent {

  fetchRequestEmitter = new EventEmitter<TableFetchRequest>();

  tableData: TableData = {
    data: [{
      identifier: 'test',
      name: 'test'
    }],
    totalElements: 1,
    totalPages: 1
  };

  columns: ITdDataTableColumn[] = [
    { name: 'identifier', label: 'identifier', sortable: true },
    { name: 'name', label: 'name', sortable: true }
  ];

  @ViewChild('datatable') dataTableComponent: DataTableComponent;

  onFetch(fetchRequest: TableFetchRequest): void {
    this.fetchRequestEmitter.emit(fetchRequest);
  }
}
