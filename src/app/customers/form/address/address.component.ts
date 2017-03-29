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
import {FormComponent} from '../../../../components/forms/form.component';
import {Validators, FormBuilder} from '@angular/forms';
import {Address} from '../../../../services/domain/address/address.model';

@Component({
  selector: 'fims-customer-address-form',
  templateUrl: './address.component.html'
})
export class CustomerAddressFormComponent extends FormComponent<Address>{

  @Input() set formData(address: Address){
    this.form = this.formBuilder.group({
      street: [address.street, Validators.required],
      city: [address.city, Validators.required],
      postalCode: [address.postalCode, Validators.maxLength(5)],
      region: [address.region],
      countryShortName: [address.countryCode, [Validators.required, Validators.maxLength(2)]],
      country: [address.country, Validators.required]
    });
  };

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): Address{
    return {
      street: this.form.get('street').value,
      city: this.form.get('city').value,
      postalCode: this.form.get('postalCode').value,
      region: this.form.get('region').value,
      countryCode: this.form.get('countryShortName').value,
      country: this.form.get('country').value
    }
  }

}
