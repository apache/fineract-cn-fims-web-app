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
import {FormArray, FormGroup, ValidationErrors} from '@angular/forms';

export function daysLateUnique(array: FormArray): ValidationErrors | null {
  const steps: FormGroup[] = array.controls as FormGroup[];

  const values = steps
    .map(optionGroup => parseInt(optionGroup.get('daysLate').value, 10));

  const set = new Set();

  values.forEach(daysLate => set.add(daysLate));

  if (set.size !== values.length) {
    return {
      daysLateUnique: true
    };
  }

  return null;
}
