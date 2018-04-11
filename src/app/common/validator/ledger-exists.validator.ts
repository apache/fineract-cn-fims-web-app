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
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {AccountingService} from '../../services/accounting/accounting.service';
import {isString} from './validators';

const invalid = Observable.of({
  invalidLedger: true
});

export function ledgerExists(accountingService: AccountingService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.dirty || !control.value || control.value.length === 0) {
      return Observable.of(null);
    }

    if (isString(control.value) && control.value.trim().length === 0) {
      return invalid;
    }

    return accountingService.findLedger(control.value, true)
      .map(ledger => null)
      .catch(() => invalid);
  };
}
