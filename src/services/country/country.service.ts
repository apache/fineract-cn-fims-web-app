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

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Country} from './model/country.model';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class CountryService {

  private countries: Country[] = [];

  constructor(private http: Http, private translateService: TranslateService) {
    this.getCountries()
      .map(countries => this.translate(countries))
      .subscribe(countries => this.countries = countries);

    translateService.onLangChange
      .map(() => this.translate(this.countries))
      .subscribe(countries => this.countries = countries);
  }

  fetchCountries(term): Country[] {
    const regTerm = new RegExp(`^${term}`, 'gi');

    let result: Country[];

    if(term) {
      result = this.countries.filter((country: Country) => regTerm.test(country.displayName));
    } else {
      result = this.countries.slice();
    }
    return result;
  }

  fetchByCountryCode(countryCode: string): Country {
    return this.countries.find((country: Country) => country.alpha2Code === countryCode)
  }

  private translate(countries: Country[]): Country[] {
    return countries.map(country => this.mapTranslation(country))
  }

  private mapTranslation(country: Country): Country {
    const currentLang = this.translateService.currentLang;
    return Object.assign({}, country, {
      displayName: currentLang !== 'en' && country.translations[currentLang] ? country.translations[currentLang] : country.name
    });
  }

  private getCountries(): Observable<Country[]> {
    return this.http.get('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;translations')
      .map(response => response.json());
  }

}
