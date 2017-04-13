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

import {EmployeeSaveEvent} from './form.component';
import {ContactDetailType, ContactDetail} from '../../../services/domain/contact/contact-detail.model';
import {Employee} from '../../../services/office/domain/employee.model';
import {UserWithPassword} from '../../../services/identity/domain/user-with-password.model';

function buildContactDetail(type: ContactDetailType, value: string): ContactDetail{
  return {
    group: 'BUSINESS',
    type: type,
    value: value,
    preferenceLevel: 1
  }
}

export function mapContactDetails(contactForm: any): ContactDetail[]{
  let contactDetails: ContactDetail[] = [];

  if(contactForm.phone){
    contactDetails.push(buildContactDetail('PHONE', contactForm.phone));
  }

  if(contactForm.mobile){
    contactDetails.push(buildContactDetail('MOBILE', contactForm.mobile));
  }

  if(contactForm.email){
    contactDetails.push(buildContactDetail('EMAIL', contactForm.email));
  }

  return contactDetails;
}

export function mapEmployee(event: EmployeeSaveEvent): Employee{
  let assignedOffice = event.officeForm.assignedOffice;

  let contactDetails: ContactDetail[] = mapContactDetails(event.contactForm);

  let employee: Employee = {
    identifier: event.detailForm.identifier,
    givenName: event.detailForm.firstName,
    middleName: event.detailForm.middleName,
    surname: event.detailForm.lastName,
    contactDetails: contactDetails,
    assignedOffice: assignedOffice ? assignedOffice : undefined
  };

  return employee;
}

export function mapUser(event: EmployeeSaveEvent): UserWithPassword{
  let userWithPassword: UserWithPassword = {
    identifier: event.detailForm.identifier,
    password: event.detailForm.password,
    role: event.detailForm.role
  };

  return userWithPassword;
}
