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
import {accountUnique} from './account-unique.validator';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

describe('accountUnique validator', () => {

  function setup(mainAccountNumber: string, accountNumbers: string[]): FormGroup {
    const payrollAllocations = new FormArray([]);
    accountNumbers.forEach(number => payrollAllocations.push(
      new FormGroup({
        accountNumber: new FormControl(number),
        amount: new FormControl(),
        proportional: new FormControl()
      })));

    const group = new FormGroup({
      mainAccountNumber: new FormControl(mainAccountNumber),
      payrollAllocations
    });

    return group;
  }

  it('should not return error when no account overlap', () => {
    const group = setup('testa', ['testb', 'testc']);

    const result = accountUnique(group);

    expect(result).toBeNull();
  });

  it('should return error when allocation account overlap with main account', () => {
    const group = setup('testa', ['testa', 'testc']);

    const result = accountUnique(group);

    expect(result).toEqual({
      accountUnique: true
    });
  });

  it('should return error when allocation account overlap with other allocation account', () => {
    const group = setup('testa', ['testb', 'testb']);

    const result = accountUnique(group);

    expect(result).toEqual({
      accountUnique: true
    });
  });
});
