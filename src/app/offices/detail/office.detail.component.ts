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
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {OfficeService} from '../../services/office/office.service';
import {Office} from '../../services/office/domain/office.model';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {OfficePage} from '../../services/office/domain/office-page.model';
import {Observable} from 'rxjs/Observable';
import {TdDialogService} from '@covalent/core';
import {TableData} from '../../common/data-table/data-table.component';
import {DELETE} from '../store/office.actions';
import {getSelectedOffice, OfficesStore} from '../store/index';
import {FimsPermission} from '../../services/security/authz/fims-permission.model';
import * as fromRoot from '../../store/index';

@Component({
  templateUrl: './office.detail.component.html'
})
export class OfficeDetailComponent implements OnInit {

  office$: Observable<Office>;

  canDelete$: Observable<boolean>;

  branchData: TableData = {
    totalElements: 0,
    totalPages: 0,
    data: []
  };

  columns: any[] = [
    {name: 'identifier', label: 'Id'},
    {name: 'name', label: 'Name'},
    {name: 'description', label: 'Description'}
  ];

  constructor(private store: OfficesStore, private route: ActivatedRoute, private router: Router, private officeService: OfficeService,
              private dialogService: TdDialogService) {
  }

  ngOnInit(): void {
    this.office$ = this.store.select(getSelectedOffice)
      .filter(office => !!office)
      .do(office => this.fetchBranches(office.identifier));

    this.canDelete$ = Observable.combineLatest(
      this.store.select(fromRoot.getPermissions),
      this.office$,
      (permissions, office: Office) => ({
        hasPermission: this.hasDeletePermission(permissions),
        noExternalReferences: !office.externalReferences
      }))
      .map(result => result.hasPermission && result.noExternalReferences);
  }

  fetchBranches(identifier: string, fetchRequest?: FetchRequest): void {
    this.officeService.listBranches(identifier, fetchRequest)
      .subscribe((officePage: OfficePage) => {
        this.branchData = {
          data: officePage.offices,
          totalElements: officePage.totalElements,
          totalPages: officePage.totalPages
        };
      });
  }

  rowSelect(office: Office): void {
    this.router.navigate(['../../', office.identifier], {relativeTo: this.route});
  }

  searchOffice(searchTerm: string): void {
    this.router.navigate(['../../../'], {queryParams: {term: searchTerm}, relativeTo: this.route});
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to delete this office?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE OFFICE',
    }).afterClosed();
  }

  deleteOffice(office: Office): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => this.store.dispatch({
        type: DELETE, payload: {
          office,
          activatedRoute: this.route
        }
      }));
  }

  private hasDeletePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
      permission.id === 'office_offices' &&
      permission.accessLevel === 'DELETE'
    ).length > 0;
  }

}
