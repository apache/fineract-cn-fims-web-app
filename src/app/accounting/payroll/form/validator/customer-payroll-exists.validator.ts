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
import {of as observableOf, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {CustomerService} from '../../../../services/customer/customer.service';
import {isString} from '../../../../common/validator/validators';
import {PayrollService} from '../../../../services/payroll/payroll.service';
import { catchError} from 'rxjs/operators'

const invalid = observableOf({
  invalidCustomer: true
});

export function customerWithConfigExists(customerService: CustomerService, payrollService: PayrollService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<any> => {
    if (!control.dirty || !control.value || control.value.length === 0) {
      return observableOf(null);
    }

    if (isString(control.value) && control.value.trim().length === 0) {
      return invalid;
    }

    return customerService.getCustomer(control.value, true).pipe(
      switchMap(customer => payrollService.findPayrollConfiguration(customer.identifier, true)),
      map(config => null),
      catchError(() => invalid));
  };
}
