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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Sort} from '../../services/domain/paging/sort.model';
import {Page} from '../../services/domain/paging/page.model';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent,
  TdDataTableSortingOrder
} from '@covalent/core';
import {TranslateService} from '@ngx-translate/core';

export interface TableData {
  data: any[];
  totalElements: number;
  totalPages: number;
}

export interface TableFetchRequest {
  page: Page,
  sort: Sort
}

@Component({
  selector: 'fims-data-table',
  templateUrl: './data-table.component.html'
})
export class DataTableComponent {

  _columns: any[];

  @Input('data') tableData: TableData = {
    totalElements: 0,
    totalPages: 0,
    data: []
  };

  @Input() set columns(columns: ITdDataTableColumn[]) {
    columns.forEach((column) => {
      this.translate.get(column.label)
        .subscribe((value) => {
          column.label = value;
          column.tooltip = value;
        });
    });
    this._columns = columns;
  };

  @Input() sortable: boolean = false;

  @Input() pageable: boolean = false;

  @Input() selectable: boolean = true;

  @Input() actionColumn: boolean = true;

  @Input() actionColumnLabel: string = 'SHOW';

  @Input() loading: boolean = false;

  @Output() onFetch: EventEmitter<TableFetchRequest> = new EventEmitter<TableFetchRequest>();
  @Output() onActionCellClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(private translate: TranslateService) {}

  pageSizes: number[] = [10, 15, 20];

  private currentPage: Page = {
    pageIndex: 0,
    size: this.pageSizes[0]
  };

  private currentSort: Sort = {
    sortColumn: 'identifier',
    sortDirection: 'ASC'
  };

  page(pagingEvent: IPageChangeEvent): void {
    this.currentPage = {
      pageIndex: pagingEvent.page -1,
      size: pagingEvent.pageSize
    };
    this.fetch();
  }

  sortChanged(event: ITdDataTableSortChangeEvent): void {
    this.currentSort = {
      sortDirection: event.order === TdDataTableSortingOrder.Ascending ? 'DESC' : 'ASC',
      sortColumn: event.name
    };
    this.fetch();
  }

  private fetch() {
    const fetchRequest: TableFetchRequest = {
      page: this.currentPage,
      sort: this.currentSort
    };
    this.onFetch.emit(fetchRequest);
  }

  actionCellClick(row): void {
    this.onActionCellClick.emit(row);
  }

  get hasData(): boolean {
    return this.tableData && this.tableData.data && this.tableData.data.length > 0;
  }

  isBoolean(value: any): boolean {
    return typeof(value) === 'boolean';
  }

}
