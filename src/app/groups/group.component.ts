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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FetchRequest } from '../services/domain/paging/fetch-request.model';
import { TableData, TableFetchRequest } from '../common/data-table/data-table.component';
import { Group } from '../services/group/domain/group.model';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../store';
import { SEARCH } from '../store/group/group.actions';
import { GroupsStore } from './store/index';

@Component({
  templateUrl: './group.component.html'
})
export class GroupComponent implements OnInit {

  groupData$: Observable<TableData>;
  loading$: Observable<boolean>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Group Name' },
    { name: 'status', label: 'Status' },
    { name: 'office', label: 'Office' }
  ];

  private searchTerm: string;

  private lastFetchRequest: FetchRequest = {};

  constructor(private router: Router, private route: ActivatedRoute, private store: GroupsStore) { }

  ngOnInit(): void {
    this.groupData$ = this.store.select(fromRoot.getGroupSearchResults)
      .map(groupPage => ({
        data: groupPage.groups,
        totalElements: groupPage.totalElements,
        totalPages: groupPage.totalPages
      }));

    this.loading$ = this.store.select(fromRoot.getGroupSearchLoading);

    this.route.queryParams.subscribe((params: Params) => {
      this.search(params['term']);
    });
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.fetchGroups();
  }

  rowSelect(group: Group): void {
    this.router.navigate(['detail', group.identifier], { relativeTo: this.route });
  }

  fetchGroups(fetchRequest?: TableFetchRequest): void {
    if (fetchRequest) {
      this.lastFetchRequest = fetchRequest;
    }

    this.lastFetchRequest.searchTerm = this.searchTerm;

    this.store.dispatch({ type: SEARCH, payload: this.lastFetchRequest });
  }

  goToDefinition(): void {
    this.router.navigate(['definition'], { relativeTo: this.route });
  }
}
