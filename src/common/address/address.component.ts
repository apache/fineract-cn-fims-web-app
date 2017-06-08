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

import {Component, Input, OnInit} from '@angular/core';
import {FormComponent} from '../forms/form.component';
import {Validators, FormBuilder} from '@angular/forms';
import {Address} from '../../services/domain/address/address.model';
import {Country} from '../../services/country/model/country.model';
import {CountryService} from '../../services/country/country.service';
import {SEARCH} from '../../app/reducers/country/country.actions';
import {countryExists} from '../validator/country-exists.validator';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/reducers/index'

@Component({
  selector: 'fims-address-form',
  templateUrl: './address.component.html'
})
export class AddressFormComponent extends FormComponent<Address> implements OnInit {

  filteredCountries: Observable<Country[]>;

  @Input() set formData(address: Address) {
    let country: Country;

    if(address) {
      country = this.countryService.fetchByCountryCode(address.countryCode);
    }

    this.form = this.formBuilder.group({
      street: [address ? address.street : undefined, Validators.required],
      city: [address ? address.city : undefined, Validators.required],
      postalCode: [address ? address.postalCode : undefined, Validators.maxLength(32)],
      region: [address ? address.region : undefined],
      country: [country, [Validators.required], countryExists(this.countryService)]
    });
  };

  constructor(private formBuilder: FormBuilder, private countryService: CountryService, private store: Store<fromRoot.State>) {
    super();
  }

  ngOnInit(): void {
    this.filteredCountries = this.store.select(fromRoot.getSearchCountry);

    this.form.get('country').valueChanges
      .startWith(null)
      .map(country => country && typeof country === 'object' ? country.displayName : country)
      .subscribe(searchTerm => this.store.dispatch({ type: SEARCH, payload: {
        searchTerm
      }}));
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
    }
  }

  countryDisplay(country: Country): string {
    return country ? country.displayName : undefined;
  }
}
