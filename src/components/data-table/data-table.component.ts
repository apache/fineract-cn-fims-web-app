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
import {IPageChangeEvent, ITdDataTableSortChangeEvent, TdDataTableSortingOrder} from '@covalent/core';
import {TranslateService} from 'ng2-translate';

export interface TableData{
  data: any[];
  totalElements: number;
  totalPages: number;
}

export interface TableFetchRequest{
  page: Page,
  sort: Sort
}

@Component({
  selector: 'fims-data-table',
  templateUrl: './data-table.component.html'
})
export class DataTableComponent{

  _columns: any[];

  @Input() data: TableData;
  @Input() set columns(columns: any[]){
    columns.forEach((column) => {
      this.translate.get(column.label).subscribe((value) => {
        column.label = value;
        column.tooltip = value;
      });
    });
    this._columns = columns;
  };
  @Input() sortBy: string;
  @Input() sortable: boolean = true;
  @Input() selectable: boolean = true;
  @Input() actionColumn: boolean = true;

  @Output() onFetch: EventEmitter<TableFetchRequest> = new EventEmitter<TableFetchRequest>();
  @Output() onActionCellClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(private translate: TranslateService) {}

  private pageSizes: number[] = [10, 15, 20];

  private currentPage: Page = {
    pageIndex: 0,
    size: this.pageSizes[0]
  };

  private currentSort: Sort = {
    sortColumn: 'identifier',
    sortDirection: 'ASC'
  };

  private page(pagingEvent: IPageChangeEvent): void{
    this.currentPage = {
      pageIndex: pagingEvent.page -1,
      size: pagingEvent.pageSize
    };
    this.fetch();
  }

  private sortChanged(event: ITdDataTableSortChangeEvent): void {
    this.currentSort = {
      sortDirection: event.order === TdDataTableSortingOrder.Ascending ? 'ASC' : 'DESC',
      sortColumn: event.name
    };
    this.fetch();
  }

  private fetch(){
    let fetchRequest: TableFetchRequest = {
      page: this.currentPage,
      sort: this.currentSort
    };
    this.onFetch.emit(fetchRequest);
  }

  actionCellClick(row): void{
    this.onActionCellClick.emit(row);
  }
}
