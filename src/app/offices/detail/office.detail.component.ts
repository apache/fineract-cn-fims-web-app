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
import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {OfficeService} from '../../../services/office/office.service';
import {Office} from '../../../services/office/domain/office.model';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {OfficePage} from '../../../services/office/domain/office-page.model';
import {Observable, Subscription} from 'rxjs';
import {NotificationService} from '../../../services/notification/notification.service';
import {TdDialogService} from '@covalent/core';
import {TableData} from '../../../components/data-table/data-table.component';
import {SelectAction, DELETE} from '../store/office.actions';
import {Store} from '@ngrx/store';
import {State, getSelectedOffice, OfficesStore} from '../store/index';

@Component({
  selector: 'fims-office-detail',
  templateUrl: './office.detail.component.html',
  styleUrls: ['./office.detail.component.scss'],
})
export class OfficeDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private officeSubscription: Subscription;

  office: Office;

  branchData: TableData = {
    totalElements: 0,
    totalPages: 0,
    data: []
  };

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' }
  ];

  constructor(private store: OfficesStore, private route: ActivatedRoute, private router: Router, private officeService: OfficeService, private dialogService: TdDialogService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.officeSubscription = this.store.select(getSelectedOffice).subscribe((office: Office) => {
      this.office = office;
      this.fetchBranches();
    });

  }

  fetchBranches(fetchRequest?: FetchRequest): void {
    this.officeService.listBranches(this.office.identifier, fetchRequest).subscribe((officePage: OfficePage) => {
      this.branchData = {
        data: officePage.offices,
        totalElements: officePage.totalElements,
        totalPages: officePage.totalPages
      };
    })
  }

  rowSelect(office: Office): void{
    this.router.navigate(['../', office.identifier], { relativeTo: this.route });
  }

  searchOffice(searchTerm: string): void{
    this.router.navigate(['../../'], { queryParams: { term: searchTerm }, relativeTo: this.route });
  }

  goToParent(): void{
    if(this.office.parentIdentifier){
      this.router.navigate(['../', this.office.parentIdentifier], { relativeTo: this.route });
    }else{
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  confirmDeletion(): Observable<boolean>{
    return this.dialogService.openConfirm({
      message: 'Do you want to delete this office?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE OFFICE',
    }).afterClosed();
  }

  deleteOffice(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => this.store.dispatch({ type: DELETE, payload: {
        office: this.office,
        activatedRoute: this.route
      } }));
  }

  ngOnDestroy(): void{
    this.actionsSubscription.unsubscribe();
    this.officeSubscription.unsubscribe();
  }
}
