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

import {CountryService} from '../../services/country/country.service';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

export function countryExists(countryService: CountryService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<any> => {
    if (!control.dirty || !control.value || control.value.length === 0) return Observable.of(null);

    const country = control.value;
    const displayName: string = country && typeof country === 'object' ? country.displayName : country;

    return Observable.of(displayName)
      .map(searchTerm => countryService.fetchCountries(displayName))
      .map(countries => {
        if(countries.length === 1 && countries[0].displayName === displayName) {
          return null;
        }
        return {
          invalidCountry: true
        }
      });
  }
}
