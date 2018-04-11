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

import {FormArray, FormBuilder} from '@angular/forms';
import {JournalEntryValidators} from './journal-entry.validator';

describe('JournalEntryValidators', () => {

  const formBuilder: FormBuilder = new FormBuilder();

  describe('minItems', () => {

    function setup(): FormArray {
      return formBuilder.array([
        formBuilder.group({ amount: [10] }),
      ]);
    }

    it('should not return error when array contains items', () => {
      const validator = JournalEntryValidators.minItems(1);

      const formArray = setup();

      expect(validator(formArray)).toBeNull();
    });

    it('should return error when array contains less items as specified', () => {
      const validator = JournalEntryValidators.minItems(2);

      const formArray = setup();

      expect(validator(formArray)).toEqual({minItemsInvalid: true});
    });

  });

  describe('equalSum', () => {

    it('should not return error when sum equal', () => {
      const validator = JournalEntryValidators.equalSum('valOne', 'valTwo');

      const formGroup = formBuilder.group({
        valOne: formBuilder.array([
          formBuilder.group({ amount: [10] }),
          formBuilder.group({ amount: [10] }),
        ]),
        valTwo: formBuilder.array([
          formBuilder.group({ amount: [10] }),
          formBuilder.group({ amount: [10] }),
        ]),
      });

      expect(validator(formGroup)).toBeNull();
    });

    it('should return error when sum not equal', () => {
      const validator = JournalEntryValidators.equalSum('valOne', 'valTwo');

      const formGroup = formBuilder.group({
        valOne: formBuilder.array([
          formBuilder.group({ amount: [10] }),
          formBuilder.group({ amount: [10] }),
        ]),
        valTwo: formBuilder.array([
          formBuilder.group({ amount: [10] }),
        ]),
      });

      expect(validator(formGroup)).toEqual({sumInvalid: true});
    });

  });

});
