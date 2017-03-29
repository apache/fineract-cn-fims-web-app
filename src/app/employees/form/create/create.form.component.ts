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
import {EmployeeFormComponent, EmployeeSaveEvent} from '../form.component';
import {mapEmployee, mapUser} from '../form.mapper';
import {Employee} from '../../../../services/office/domain/employee.model';
import {User} from '../../../../services/identity/domain/user.model';
import {UserWithPassword} from '../../../../services/identity/domain/user-with-password.model';
import * as fromEmployees from '../../store';
import {Subscription} from 'rxjs';
import {CREATE} from '../../store/employee.actions';
import {Error} from '../../../../services/domain/error.model';
import {EmployeesStore} from '../../store/index';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateEmployeeFormComponent implements OnInit, OnDestroy{

  private formStateSubscription: Subscription;

  employee: Employee = { identifier: '', givenName: '', surname: '', contactDetails: []};

  user: User = { identifier: '', role: ''};

  @ViewChild('form') formComponent: EmployeeFormComponent;

  constructor(private router: Router, private route: ActivatedRoute, private store: EmployeesStore){}

  ngOnInit(): void {
    this.formStateSubscription = this.store.select(fromEmployees.getEmployeeFormState)
      .filter(payload => !!payload.error)
      .subscribe((payload: {error: Error}) => {
        switch(payload.error.status){
          case 409:
            let officeDetailForm = this.formComponent.detailForm;
            let errors = officeDetailForm.get('identifier').errors || {};
            errors['unique'] = true;
            officeDetailForm.get('identifier').setErrors(errors);
            this.formComponent.step.open();
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
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
