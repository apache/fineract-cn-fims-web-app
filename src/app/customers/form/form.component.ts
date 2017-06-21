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

import {Component, OnInit, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import {TdStepComponent} from '@covalent/core';
import {Customer} from '../../../services/customer/domain/customer.model';
import {CustomerDetailFormData, CustomerDetailFormComponent} from './detail/detail.component';
import {AddressFormComponent} from '../../../common/address/address.component';
import {Address} from '../../../services/domain/address/address.model';
import {CustomerContactFormComponent} from './contact/contact.component';
import {ContactDetail} from '../../../services/domain/contact/contact-detail.model';
import {Value} from '../../../services/catalog/domain/value.model';
import {CustomerCustomFieldsComponent} from './customFields/custom-fields.component';

@Component({
  selector: 'fims-customer-form-component',
  templateUrl: './form.component.html'
})
export class CustomerFormComponent implements OnInit {

  @Input('customer') set customer(customer: Customer) {
    this.detailFormData = {
      identifier: customer.identifier,
      firstName: customer.givenName,
      middleName: customer.middleName,
      lastName: customer.surname,
      birthDay: customer.dateOfBirth.day,
      birthMonth: customer.dateOfBirth.month,
      birthYear: customer.dateOfBirth.year,
      member: customer.member
    };

    this.addressFormData = customer.address;

    this.contactFormData = customer.contactDetails;

    this.selectedOffices = customer.assignedOffice ? [customer.assignedOffice] : [];

    this.selectedEmployees = customer.assignedEmployee ? [customer.assignedEmployee] : [];

    this.customFieldsFormData = customer.customValues;
  };

  @Input('editMode') editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<Customer>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('detailsStep') step: TdStepComponent;

  @ViewChild('detailForm') detailForm: CustomerDetailFormComponent;
  detailFormData: CustomerDetailFormData;

  @ViewChild('contactForm') contactForm: CustomerContactFormComponent;
  contactFormData: ContactDetail[];

  @ViewChild('addressForm') addressForm: AddressFormComponent;
  addressFormData: Address;

  selectedOffices: string[] = [];

  selectedEmployees: string[] = [];

  @ViewChild('customFieldsForm') customFieldsForm: CustomerCustomFieldsComponent;
  customFieldsFormData: Value[];

  ngOnInit() {
    this.openDetailStep();
  }

  openDetailStep(): void{
    this.step.open();
  }

  showIdentifierValidationError(): void{
    this.detailForm.setError('identifier', 'unique', true);
    this.openDetailStep();
  }

  selectOffice(selections: string[]): void {
    this.selectedOffices = selections;
  }

  selectEmployee(selections: string[]): void {
    this.selectedEmployees = selections;
  }

  get isValid(): boolean {
    return (this.detailForm.valid && this.addressForm.valid) && this.contactForm.validWhenOptional && this.customFieldsForm.validWhenOptional
  }

  save() {
    const detailFormData = this.detailForm.formData;

    const customer: Customer = {
      identifier: detailFormData.identifier,
      givenName: detailFormData.firstName,
      surname: detailFormData.lastName,
      middleName: detailFormData.middleName,
      type: 'PERSON',
      address: this.addressForm.formData,
      contactDetails: this.contactForm.formData,
      dateOfBirth: {
        day: detailFormData.birthDay,
        month: detailFormData.birthMonth,
        year: detailFormData.birthYear
      },
      member: detailFormData.member,
      assignedOffice: this.selectedOffices && this.selectedOffices.length > 0 ? this.selectedOffices[0] : undefined,
      assignedEmployee: this.selectedEmployees && this.selectedEmployees.length > 0 ? this.selectedEmployees[0] : undefined,
      customValues: this.customFieldsForm.formData
    };
    this.onSave.emit(customer);
  }

  cancel() {
    this.onCancel.emit();
  }

}
