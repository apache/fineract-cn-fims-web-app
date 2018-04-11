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
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Currency} from './domain/currency.model';

@Injectable()
export class CurrencyService {

  private currencies: Currency[] = [
    {code: 'BZD', name: 'Belize Dollar', sign: '$', digits: 2},
    {code: 'EUR', name: 'Euro', sign: '€', digits: 2},
    {code: 'GMD', name: 'Gambian Dalasi', sign: 'D', digits: 2},
    {code: 'JMD', name: 'Jamaican Dollar', sign: '$', digits: 2},
    {code: 'MXN', name: 'Mexican Peso', sign: '$', digits: 2},
    {code: 'USD', name: 'US Dollar', sign: '$', digits: 2},
    {code: 'TTD', name: 'Trinidad and Tobago Dollar', sign: '$', digits: 2},
    {code: 'XCD', name: 'East Caribbean Dollar', sign: '$', digits: 2}
  ];

  fetchCurrencies(): Observable<Currency[]> {
    return Observable.of(this.currencies.slice(0));
  }

  getCurrency(code: string): Currency {
    const foundCurrency = this.currencies.find(currency => currency.code === code);
    return Object.assign({}, foundCurrency);
  }
}
