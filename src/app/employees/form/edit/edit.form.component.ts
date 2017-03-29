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
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {EmployeeSaveEvent, EmployeeFormComponent} from '../form.component';
import {mapEmployee, mapContactDetails} from '../form.mapper';
import {Employee} from '../../../../services/office/domain/employee.model';
import {User} from '../../../../services/identity/domain/user.model';
import {UPDATE} from '../../store/employee.actions';
import {Subscription} from 'rxjs';
import {EmployeesStore, getSelectedEmployee} from '../../store/index';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditEmployeeFormComponent implements OnInit, OnDestroy {

  private employeeSubscription: Subscription;

  @ViewChild('form') formComponent: EmployeeFormComponent;

  employee: Employee;

  user: User;

  constructor(private router: Router, private route: ActivatedRoute, private store: EmployeesStore) {}

  ngOnInit() {
    this.employeeSubscription = this.store.select(getSelectedEmployee)
      .subscribe(employee => this.employee = employee);

    this.route.data.subscribe((data: { user: User }) => {
      this.user = data.user;
    });
  }

  ngOnDestroy(): void {
    this.employeeSubscription.unsubscribe();
  }

  onSave(event: EmployeeSaveEvent) {
    let employee: Employee = mapEmployee(event);

    this.store.dispatch({ type: UPDATE, payload: {
      employee: employee,
      contactDetails: mapContactDetails(event.contactForm),
      role: event.roleForm.role,
      password: event.detailForm.password,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateToOffice();
  }

  private navigateToOffice() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
