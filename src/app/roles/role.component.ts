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
import {ActivatedRoute, Router} from '@angular/router';
import {Role} from '../../services/identity/domain/role.model';
import {TableData} from '../../common/data-table/data-table.component';
import * as fromRoot from '../reducers'
import {Observable} from 'rxjs';
import {SEARCH} from '../reducers/role/role.actions';
import {RolesStore} from './store/index';

@Component({
  templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit {

  rolesData$: Observable<TableData>;

  loading$: Observable<boolean>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: RolesStore) {}

  ngOnInit(): void {
    this.rolesData$ = this.store.select(fromRoot.getRoleSearchResults)
      .map(rolePage => ({
          data: rolePage.roles,
          totalElements: rolePage.totalElements,
          totalPages: rolePage.totalPages
        })
      );

    this.loading$ = this.store.select(fromRoot.getRoleSearchLoading);

    this.store.dispatch({ type: SEARCH });
  }

  rowSelect(role: Role): void {
    this.router.navigate(['detail', role.identifier], { relativeTo: this.route });
  }

}
