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
import {Observable} from 'rxjs/Observable';
import {FormControl, ValidationErrors} from '@angular/forms';
import {fakeAsync, tick} from '@angular/core/testing';
import {accountExists} from './account-exists.validator';
import {ledgerExists} from './ledger-exists.validator';
import {employeeExists} from './employee-exists.validator';
import {customerExists} from './customer-exists.validator';

describe('exists validator', () => {

  function createValidator(validator: any, methodName: string): any {
    const service = jasmine.createSpyObj('service', [methodName]);

    return (value: string, returnValue?: any): Observable<ValidationErrors> => {
      service[methodName].and.returnValue(returnValue);

      const control = new FormControl(value);
      control.markAsDirty();

      return validator(service)(control) as Observable<ValidationErrors>;
    };
  }

  interface TestCase {
    validator: any;
    expectedResult: any;
  }

  const accountValidator = createValidator(accountExists, 'findAccount');
  const ledgerValidator = createValidator(ledgerExists, 'findLedger');
  const employeeValidator = createValidator(employeeExists, 'getEmployee');
  const customerValidator = createValidator(customerExists, 'getCustomer');

  const testWithValidResults: TestCase[] = [
    { validator: accountValidator, expectedResult: null },
    { validator: ledgerValidator, expectedResult: null },
    { validator: employeeValidator, expectedResult: null },
    { validator: customerValidator, expectedResult: null }
  ];

  const testWithInvalidResults: TestCase[] = [
    { validator: accountValidator, expectedResult: { invalidAccount: true } },
    { validator: ledgerValidator, expectedResult: { invalidLedger: true } },
    { validator: employeeValidator, expectedResult: { invalidEmployee: true } },
    { validator: customerValidator, expectedResult: { invalidCustomer: true } }
  ];

  testWithValidResults.forEach(test => {
    it('should not return error when no value', fakeAsync(() => {
      const validator = test.validator('');

      let result = null;

      validator.subscribe(validatorResult => result = validatorResult);

      tick();

      expect(result).toEqual(test.expectedResult);
    }));
  });

  testWithInvalidResults.forEach(test => {
    it('should not return error when no value', fakeAsync(() => {
      const validator = test.validator(' ');

      let result = null;

      validator.subscribe(validatorResult => result = validatorResult);

      tick();

      expect(result).toEqual(test.expectedResult);
    }));
  });

  testWithValidResults.forEach(test => {
    it('should not return error when found', fakeAsync(() => {

      const validator = test.validator('test', Observable.of({
        identifier: 'test'
      }));

      let expectedResult = null;

      validator.subscribe(result => expectedResult = result);

      tick();

      expect(expectedResult).toEqual(test.expectedResult);
    }));
  });


  testWithInvalidResults.forEach(test => {
    it('should return error when not found', fakeAsync(() => {
      const validator = test.validator('test', Observable.throw({}));

      let expectedResult = null;

      validator.subscribe(result => expectedResult = result);

      tick();

      expect(expectedResult).toEqual(test.expectedResult);
    }));
  });




});
