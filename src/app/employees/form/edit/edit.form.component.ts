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
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeFormComponent, EmployeeFormData, EmployeeSaveEvent} from '../form.component';
import {mapContactDetails, mapEmployee} from '../form.mapper';
import {Employee} from '../../../services/office/domain/employee.model';
import {User} from '../../../services/identity/domain/user.model';
import {UPDATE} from '../../store/employee.actions';
import {Observable} from 'rxjs/Observable';
import {EmployeesStore, getSelectedEmployee} from '../../store/index';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditEmployeeFormComponent implements OnInit {

  @ViewChild('form') formComponent: EmployeeFormComponent;

  formData: Observable<EmployeeFormData>;

  employee: Employee;

  user: User;

  constructor(private router: Router, private route: ActivatedRoute, private store: EmployeesStore) {}

  ngOnInit() {
    this.formData = Observable.combineLatest(
      this.store.select(getSelectedEmployee),
      this.route.data,
      (employee: Employee, data: { user: User }) => {
        return {
          user: data.user,
          employee: employee
        };
      }
    );
  }

  onSave(event: EmployeeSaveEvent) {
    const employee: Employee = mapEmployee(event);

    this.store.dispatch({ type: UPDATE, payload: {
      employee: employee,
      contactDetails: mapContactDetails(event.contactForm),
      role: event.detailForm.role,
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
