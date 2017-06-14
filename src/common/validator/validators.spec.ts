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

import {FimsValidators} from './validators';
import {FormControl, FormGroup} from '@angular/forms';

describe('Validators', () => {
  describe('urlSafe', () => {

    it('should not return error when url safe', () => {
      let validator = FimsValidators.urlSafe();
      expect(validator(new FormControl('test-test'))).toBeNull();
    });

    it('should return error when not url safe', () => {
      let validator = FimsValidators.urlSafe();
      expect(validator(new FormControl(' '))).toEqual({ urlSafe: true });
    })

  });

  describe('precision', () => {

    it('should not return error when precision matches', () => {
      let validator = FimsValidators.precision(1);
      expect(validator(new FormControl(1.1))).toBeNull();
    });

    it('should return error when precision 1', () => {
      let validator = FimsValidators.precision(1);
      expect(validator(new FormControl(1))).toEqual({
        precision: {
          valid: false,
          value: 1
        },
      });
    });

    it('should return error when precision 0', () => {
      let validator = FimsValidators.precision(0);
      expect(validator(new FormControl(1.2))).toEqual({
        precision: {
          valid: false,
          value: 0
        }
      });
    });
  });

  describe('minValue', () => {

    it('should not return error when min value 0', () => {
      let validator = FimsValidators.minValue(0);
      expect(validator(new FormControl(0))).toBeNull();
    });

    it('should return error when min value 0', () => {
      let validator = FimsValidators.minValue(0);
      expect(validator(new FormControl(-1))).toEqual({
        minValue: {
          valid: false,
          value: 0
        }
      });
    })

  });

  describe('maxValue', () => {

    it('should not return error when max value 10', () => {
      let validator = FimsValidators.maxValue(10);
      expect(validator(new FormControl(10))).toBeNull();
    });

    it('should return error when max value 10', () => {
      let validator = FimsValidators.maxValue(10);
      expect(validator(new FormControl(11))).toEqual({
        maxValue: {
          valid: false,
          value: 10
        }
      });
    })

  });

  describe('greaterThan', () => {

    let dateOne = new Date();
    let dateTwo = new Date(dateOne.getTime() + 1000);

    it('should not return error when range is correct', () => {
      let group = new FormGroup({f1: new FormControl(dateOne.toISOString()), f2: new FormControl(dateTwo.toISOString())});
      let validator = FimsValidators.matchRange('f1', 'f2');
      expect(validator(group)).toBeNull();
    });

    it('should return error when range is incorrect', () => {
      let group = new FormGroup({f1: new FormControl(dateOne.toISOString()), f2: new FormControl(dateTwo.toISOString())});
      let validator = FimsValidators.matchRange('f2', 'f1');
      expect(validator(group)).toEqual({
        rangeInvalid: true
      });
    })
  })
});
