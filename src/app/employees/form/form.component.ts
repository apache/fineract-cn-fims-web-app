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
import {Component, ViewChild, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {TdStepComponent} from '@covalent/core';
import {Office} from '../../../services/office/domain/office.model';
import {Employee} from '../../../services/office/domain/employee.model';
import {ContactDetail, BUSINESS, PHONE, EMAIL, MOBILE} from '../../../services/domain/contact/contact-detail.model';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Role} from '../../../services/identity/domain/role.model';
import {User} from '../../../services/identity/domain/user.model';
import {FimsValidators} from '../../../components/validator/validators';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {SEARCH as SEARCH_OFFICE} from '../../reducers/office/office.actions';
import {SEARCH as SEARCH_ROLE} from '../../reducers/role/role.actions';

export interface EmployeeSaveEvent{
  detailForm: {
    identifier: string,
    firstName: string,
    middleName: string,
    lastName: string,
    password: string
  },
  contactForm: {
    email: string,
    phone: string,
    mobile: string,
  },
  officeForm: {
    assignedOffice: string,
  },
  roleForm: {
    role: string
  }
}

@Component({
  selector: 'fims-employee-form-component',
  templateUrl: './form.component.html'
})
export class EmployeeFormComponent implements OnInit{

  offices: Observable<Office[]>;

  roles: Observable<Role[]>;

  detailForm: FormGroup;
  contactForm: FormGroup;
  officeForm: FormGroup;
  roleForm: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input('editMode') editMode: boolean;

  @Input('employee') set employee(employee: Employee){
    this.prepareDetailForm(employee);
    this.prepareOfficeForm(employee);
    this.prepareContactForm(employee.contactDetails);
  };

  @Input('user') set user(user: User){
    this.prepareRoleForm(user);
  };

  @Output('onSave') onSave = new EventEmitter<EmployeeSaveEvent>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private store: Store<fromRoot.State>) {}

  ngOnInit(): void{
    this.offices = this.store.select(fromRoot.getOfficeSearchResults)
      .map(officePage => officePage.offices);
    this.roles = this.store.select(fromRoot.getRoleSearchResults)
      .map(rolesPage => rolesPage.roles);

    this.step.open();
  }

  prepareDetailForm(employee: Employee): void{
    this.detailForm = this.formBuilder.group({
      identifier: [employee.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      firstName: [employee.givenName, Validators.required],
      middleName: [employee.middleName],
      lastName: [employee.surname, Validators.required],
      password: ['', this.editMode ? Validators.nullValidator : Validators.required]
    });
  }

  private prepareRoleForm(user: User) {
    this.roleForm = this.formBuilder.group({
      role: [user ? user.role : '', Validators.required]
    });
  }

  private prepareOfficeForm(employee: Employee) {
    this.officeForm = this.formBuilder.group({
      assignedOffice: [employee.assignedOffice]
    });
  }

  private prepareContactForm(contactDetails: ContactDetail[]): void{
    let phone: string = '';
    let mobile: string = '';
    let email: string = '';

    let businessContacts: ContactDetail[] = contactDetails.filter(contactDetail => contactDetail.group === BUSINESS);

    if(businessContacts.length){
      phone = this.getFirstItemByType(businessContacts, PHONE);
      mobile = this.getFirstItemByType(businessContacts, MOBILE);
      email = this.getFirstItemByType(businessContacts, EMAIL);
    }

    this.contactForm = this.formBuilder.group({
      email: [email],
      phone: [phone],
      mobile: [mobile]
    });
  }

  getFirstItemByType(contactDetails: ContactDetail[], type: string): string{
    let items = contactDetails.filter(contact => contact.type === type);
    return items.length ? items[0].value : '';
  }

  formsInvalid(): boolean{
    return (!this.officeForm.pristine && this.officeForm.invalid) ||
    (!this.contactForm.pristine && this.contactForm.invalid)
      || this.detailForm.invalid
      || this.roleForm.invalid;
  }

  save(): void{
    this.onSave.emit({
      detailForm: this.detailForm.value,
      contactForm: this.contactForm.value,
      officeForm: this.officeForm.value,
      roleForm: this.roleForm.value
    });
  }

  cancel(): void{
    this.onCancel.emit();
  }

  searchOffice(searchTerm: string): void {
    let fetchRequest: FetchRequest = {
      searchTerm: searchTerm
    };
    this.store.dispatch({ type: SEARCH_OFFICE, payload: fetchRequest });
  }

  assignOffice(selections: string[]): void{
    this.setFormValue(this.officeForm, {'assignedOffice': selections && selections.length > 0 ? selections[0] : undefined});
  }

  searchRole(term: string): void{
    this.store.dispatch({ type: SEARCH_ROLE, payload: term });
  }

  assignRole(selections: string[]){
    this.setFormValue(this.roleForm, { 'role': selections && selections.length > 0 ? selections[0] : undefined});
  }

  private setFormValue(form: FormGroup, value: any){
    form.setValue(value);
    form.markAsDirty();
  }
}
