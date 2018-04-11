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
import {Component, Input, OnInit} from '@angular/core';
import {FormComponent} from '../forms/form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {Address} from '../../services/domain/address/address.model';
import {Country} from '../../services/country/model/country.model';
import {CountryService} from '../../services/country/country.service';
import {countryExists} from '../validator/country-exists.validator';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'fims-address-form',
  templateUrl: './address.component.html'
})
export class AddressFormComponent extends FormComponent<Address> implements OnInit {

  filteredCountries: Observable<Country[]>;

  @Input() set formData(address: Address) {
    let country: Country;

    if (address) {
      country = this.countryService.fetchByCountryCode(address.countryCode);
    }

    this.form = this.formBuilder.group({
      street: [address ? address.street : undefined, [Validators.required, Validators.maxLength(256)]],
      city: [address ? address.city : undefined, [Validators.required, Validators.maxLength(256)]],
      postalCode: [address ? address.postalCode : undefined, Validators.maxLength(32)],
      region: [address ? address.region : undefined, Validators.maxLength(256)],
      country: [country, [Validators.required], countryExists(this.countryService)]
    });
  };

  constructor(private formBuilder: FormBuilder, private countryService: CountryService) {
    super();
  }

  ngOnInit(): void {
    this.filteredCountries = this.form.get('country').valueChanges
      .startWith(null)
      .map(country => country && typeof country === 'object' ? country.displayName : country)
      .map(searchTerm => this.countryService.fetchCountries(searchTerm));
  }

  get formData(): Address {
    const country: Country = this.form.get('country').value;

    return {
      street: this.form.get('street').value,
      city: this.form.get('city').value,
      postalCode: this.form.get('postalCode').value,
      region: this.form.get('region').value,
      country: country.name,
      countryCode: country.alpha2Code
    };
  }

  countryDisplay(country: Country): string {
    return country ? country.displayName : undefined;
  }
}
