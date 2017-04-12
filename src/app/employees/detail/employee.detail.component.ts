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
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Employee} from '../../../services/office/domain/employee.model';
import {TdDialogService} from '@covalent/core';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../../services/identity/domain/user.model';
import * as fromEmployee from '../store';
import {DELETE, SelectAction} from '../store/employee.actions';
import {EmployeesStore} from '../store/index';

@Component({
  selector: 'fims-employee-detail',
  templateUrl: './employee.detail.component.html'
})
export class EmployeeDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private employeeSubscription: Subscription;

  employee: Employee;

  user: User;

  constructor(private route: ActivatedRoute, private router: Router, private dialogService: TdDialogService, private store: EmployeesStore) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.employeeSubscription = this.store.select(fromEmployee.getSelectedEmployee)
      .subscribe(employee => this.employee = employee);

    // TODO load user via store
    this.route.data.subscribe(( data: { user: User }) => {
      this.user = data.user;
    });
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.employeeSubscription.unsubscribe();
  }

  searchEmployee(term): void {
    if(!term) return;
    this.goToOverviewPage(term);
  }

  confirmDeletion(): Observable<boolean>{
    return this.dialogService.openConfirm({
      message: 'Do you want to delete employee "' + this.employee.givenName + ' ' + this.employee.surname + '"?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE EMPLOYEE',
    }).afterClosed();
  }

  deleteEmployee(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch({ type: DELETE, payload: {
          employee: this.employee,
          activatedRoute: this.route
        } })
      });
  }

  goToOverviewPage(term?: string): void{
    this.router.navigate(['../../'], { queryParams: { term: term }, relativeTo: this.route });
  }
}
