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
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {TdStepComponent} from '@covalent/core';
import {Office} from '../../services/office/domain/office.model';
import {Employee} from '../../services/office/domain/employee.model';
import {BUSINESS, ContactDetail, EMAIL, MOBILE, PHONE} from '../../services/domain/contact/contact-detail.model';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {Role} from '../../services/identity/domain/role.model';
import {User} from '../../services/identity/domain/user.model';
import {FimsValidators} from '../../common/validator/validators';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../store';
import {SEARCH as SEARCH_OFFICE} from '../../store/office/office.actions';
import {SEARCH as SEARCH_ROLE} from '../../store/role/role.actions';

export interface EmployeeFormData {
  user: User;
  employee: Employee;
}

export interface EmployeeSaveEvent {
  detailForm: {
    identifier: string;
    firstName: string;
    middleName: string;
    lastName: string;
    password: string;
    role: string;
  };
  contactForm: {
    email: string;
    phone: string;
    mobile: string;
  };
  officeForm: {
    assignedOffice: string;
  };
}

@Component({
  selector: 'fims-employee-form-component',
  templateUrl: './form.component.html'
})
export class EmployeeFormComponent implements OnInit {

  offices: Observable<Office[]>;

  roles: Observable<Role[]>;

  detailForm: FormGroup;
  contactForm: FormGroup;
  officeForm: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input('editMode') editMode: boolean;

  @Input('formData') set formData(formData: EmployeeFormData) {
    this.prepareDetailForm(formData.employee, formData.user);
    this.prepareOfficeForm(formData.employee);
    this.prepareContactForm(formData.employee.contactDetails);
  }

  @Output('onSave') onSave = new EventEmitter<EmployeeSaveEvent>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.offices = this.store.select(fromRoot.getOfficeSearchResults)
      .map(officePage => officePage.offices);

    this.roles = this.store.select(fromRoot.getRoleSearchResults)
      .map(rolesPage => rolesPage.roles);

    this.fetchRoles();

    this.step.open();
  }

  prepareDetailForm(employee: Employee, user: User): void {
    const passwordValidators: ValidatorFn[] = [Validators.minLength(8)];

    if (!this.editMode) {
      passwordValidators.push(Validators.required);
    }

    this.detailForm = this.formBuilder.group({
      identifier: [employee.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      firstName: [employee.givenName, [Validators.required, Validators.maxLength(256)]],
      middleName: [employee.middleName, Validators.maxLength(256)],
      lastName: [employee.surname, [Validators.required, Validators.maxLength(256)]],
      password: ['', passwordValidators],
      role: [user ? user.role : '', Validators.required]
    });
  }

  private prepareOfficeForm(employee: Employee) {
    this.officeForm = this.formBuilder.group({
      assignedOffice: [employee.assignedOffice]
    });
  }

  private prepareContactForm(contactDetails: ContactDetail[]): void {
    let phone = '';
    let mobile = '';
    let email = '';

    const businessContacts: ContactDetail[] = contactDetails.filter(contactDetail => contactDetail.group === BUSINESS);

    if (businessContacts.length) {
      phone = this.getFirstItemByType(businessContacts, PHONE);
      mobile = this.getFirstItemByType(businessContacts, MOBILE);
      email = this.getFirstItemByType(businessContacts, EMAIL);
    }

    this.contactForm = this.formBuilder.group({
      email: [email, [Validators.maxLength(256), FimsValidators.email]],
      phone: [phone, Validators.maxLength(256)],
      mobile: [mobile, Validators.maxLength(256)]
    });
  }

  getFirstItemByType(contactDetails: ContactDetail[], type: string): string {
    const items = contactDetails.filter(contact => contact.type === type);
    return items.length ? items[0].value : '';
  }

  formsInvalid(): boolean {
    return (!this.officeForm.pristine && this.officeForm.invalid) ||
    (!this.contactForm.pristine && this.contactForm.invalid)
      || this.detailForm.invalid;
  }

  save(): void {
    this.onSave.emit({
      detailForm: this.detailForm.value,
      contactForm: this.contactForm.value,
      officeForm: this.officeForm.value
    });
  }

  cancel(): void {
    this.onCancel.emit();
  }

  searchOffice(searchTerm: string): void {
    const fetchRequest: FetchRequest = {
      searchTerm
    };
    this.store.dispatch({ type: SEARCH_OFFICE, payload: fetchRequest });
  }

  assignOffice(selections: string[]): void {
    this.setFormValue(this.officeForm, {'assignedOffice': selections && selections.length > 0 ? selections[0] : undefined});
  }

  fetchRoles(): void {
    this.store.dispatch({ type: SEARCH_ROLE });
  }

  private setFormValue(form: FormGroup, value: any) {
    form.setValue(value);
    form.markAsDirty();
  }
}
