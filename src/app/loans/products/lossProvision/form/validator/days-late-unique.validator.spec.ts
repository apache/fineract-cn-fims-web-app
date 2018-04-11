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
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {daysLateUnique} from './days-late-unique.validator';

describe('days late unique validator', () => {

  function setup(daysLate: number[]): FormArray {
    const steps = new FormArray([]);
    daysLate.forEach(number => steps.push(
      new FormGroup({
        daysLate: new FormControl(number),
      })));

    return steps;
  }

  it('should not return error when no days late overlap', () => {
    const group = setup([1, 2, 3]);

    const result = daysLateUnique(group);

    expect(result).toBeNull();
  });

  it('should return error when days late overlap', () => {
    const group = setup([1, 2, 2]);

    const result = daysLateUnique(group);

    expect(result).toEqual({
      daysLateUnique: true
    });
  });

});
