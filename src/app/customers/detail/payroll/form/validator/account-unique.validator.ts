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
import {FormGroup, ValidationErrors} from '@angular/forms';
import {PayrollAllocation} from '../../../../../services/payroll/domain/payroll-allocation.model';
import {isEmptyInputValue} from '../../../../../common/validator/validators';

export function accountUnique(group: FormGroup): ValidationErrors | null {
  const mainAccountNumber: string = group.controls.mainAccountNumber.value;
  const payrollAllocations: PayrollAllocation[] = group.controls.payrollAllocations.value;

  if (isEmptyInputValue(mainAccountNumber)) {
    return;
  }

  const numbers = payrollAllocations
    .filter(allocation => allocation.accountNumber.length > 0)
    .map(allocation => allocation.accountNumber);

  const set = new Set();

  numbers.forEach(number => set.add(number));

  if (numbers.indexOf(mainAccountNumber) > -1 || set.size !== numbers.length) {
    return {
      accountUnique: true
    };
  }

  return null;
}
