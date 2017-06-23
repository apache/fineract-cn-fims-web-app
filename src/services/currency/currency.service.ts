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
import {Observable} from 'rxjs/Observable';
import {Currency} from './domain/currency.model';

@Injectable()
export class CurrencyService {

  private currencies: Currency[] = [
    { code: 'BZD', name: 'Belize Dollar', sign: '$', digits: 2 },
    { code: 'EUR', name: 'Euro', sign: '€', digits: 2 },
    { code: 'GMD', name: 'Gambian Dalasi', sign: 'D', digits: 2 },
    { code: 'USD', name: 'US Dollar', sign: '$', digits: 2 },
    { code: 'XCD', name: 'East Caribbean Dollar', sign: '$', digits: 2 }
  ];

  fetchCurrencies(): Observable<Currency[]> {
    return Observable.of(this.currencies.slice(0));
  }

  getCurrency(code: string): Currency {
    const currency = this.currencies.find(currency => currency.code === code);
    return Object.assign({}, currency);
  }
}
