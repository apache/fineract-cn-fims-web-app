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

import {Component, Input} from '@angular/core';
import {FormComponent} from '../../../common/forms/form.component';
import {FormBuilder, FormControl, AbstractControl, Validators} from '@angular/forms';
import {
  ContactDetail, ContactDetailType, EMAIL, MOBILE,
  PHONE, BUSINESS
} from '../../../services/domain/contact/contact-detail.model';
import {getContactDetailValueByType} from '../../contact.helper';
import {FimsValidators} from '../../../common/validator/validators';

@Component({
  selector: 'fims-customer-contact-form',
  templateUrl: './contact.component.html'
})
export class CustomerContactFormComponent extends FormComponent<ContactDetail[]> {

  @Input() set formData(contactDetails: ContactDetail[]) {
    if (!contactDetails) throw new Error('contact details must be defined');

    let phone: string = '';
    let mobile: string = '';
    let email: string = '';

    let businessContacts: ContactDetail[] = contactDetails.filter(contactDetail => contactDetail.group === BUSINESS);

    if (businessContacts.length) {
      phone = getContactDetailValueByType(businessContacts, PHONE);
      mobile = getContactDetailValueByType(businessContacts, MOBILE);
      email = getContactDetailValueByType(businessContacts, EMAIL);
    }

    this.form = this.formBuilder.group({
      email: [email, [Validators.maxLength(32), FimsValidators.email]],
      phone: [phone, Validators.maxLength(32)],
      mobile: [mobile, Validators.maxLength(32)]
    });
  };

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): ContactDetail[] {
    const contactDetails: ContactDetail[] = [];

    this.pushIfValue(contactDetails, this.form.get('email'), 'EMAIL');
    this.pushIfValue(contactDetails, this.form.get('mobile'), 'MOBILE');
    this.pushIfValue(contactDetails, this.form.get('phone'), 'PHONE');

    return contactDetails;
  }

  private pushIfValue(contactDetails: ContactDetail[], control: AbstractControl, type: ContactDetailType): void {
    if (control.value && control.value.length > 0) {
      contactDetails.push({
        group: 'BUSINESS',
        type: type,
        value: control.value,
        preferenceLevel: 1
      });
    }
  }

}
