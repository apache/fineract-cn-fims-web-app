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
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeFormComponent, EmployeeFormData, EmployeeSaveEvent} from '../form.component';
import {mapEmployee, mapUser} from '../form.mapper';
import {Employee} from '../../../../services/office/domain/employee.model';
import {UserWithPassword} from '../../../../services/identity/domain/user-with-password.model';
import * as fromEmployees from '../../store';
import {Subscription} from 'rxjs';
import {CREATE, RESET_FORM} from '../../store/employee.actions';
import {Error} from '../../../../services/domain/error.model';
import {EmployeesStore} from '../../store/index';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateEmployeeFormComponent implements OnInit, OnDestroy{

  private formStateSubscription: Subscription;

  @ViewChild('form') formComponent: EmployeeFormComponent;

  employeeFormData: EmployeeFormData = {
    user: { identifier: '', role: ''},
    employee: { identifier: '', givenName: '', surname: '', contactDetails: [] }
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: EmployeesStore){}

  ngOnInit(): void {
    this.formStateSubscription = this.store.select(fromEmployees.getEmployeeFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => {
        let detailForm = this.formComponent.detailForm;
        let errors = detailForm.get('identifier').errors || {};
        errors['unique'] = true;
        detailForm.get('identifier').setErrors(errors);
        this.formComponent.step.open();
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(event: EmployeeSaveEvent): void {
    let employee: Employee = mapEmployee(event);
    let user: UserWithPassword = mapUser(event);

    this.store.dispatch({ type: CREATE, payload: {
      employee: employee,
      user: user,
      activatedRoute: this.route
    }});

  }

  onCancel(): void{
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
