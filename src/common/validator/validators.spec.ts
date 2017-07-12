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
      const result = FimsValidators.urlSafe(new FormControl('test-test'));
      expect(result).toBeNull();
    });

    it('should return error when not url safe', () => {
      const result = FimsValidators.urlSafe(new FormControl(' '));
      expect(result).toEqual({ urlSafe: true });
    })

  });

  describe('scale', () => {

    it('should not return error when scale matches', () => {
      const validator = FimsValidators.scale(1);
      expect(validator(new FormControl(1.1))).toBeNull();
    });

    it('should return error when scale 1', () => {
      const validator = FimsValidators.scale(1);
      expect(validator(new FormControl(1))).toEqual({
        scale: {
          valid: false,
          value: 1
        },
      });
    });

    it('should return error when scale 0', () => {
      const validator = FimsValidators.scale(0);
      expect(validator(new FormControl(1.2))).toEqual({
        scale: {
          valid: false,
          value: 0
        }
      });
    });
  });

  describe('minValue', () => {

    it('should not return error when min value 0', () => {
      const validator = FimsValidators.minValue(0);
      expect(validator(new FormControl(0))).toBeNull();
    });

    it('should return error when min value 0', () => {
      const validator = FimsValidators.minValue(0);
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
      const validator = FimsValidators.maxValue(10);
      expect(validator(new FormControl(10))).toBeNull();
    });

    it('should return error when max value 10', () => {
      const validator = FimsValidators.maxValue(10);
      expect(validator(new FormControl(11))).toEqual({
        maxValue: {
          valid: false,
          value: 10
        }
      });
    })

  });

  describe('greaterThan', () => {
    const dateOne = new Date();
    const dateTwo = new Date(dateOne.getTime() + 1000);

    it('should not return error when range is correct', () => {
      const group = new FormGroup({f1: new FormControl(dateOne.toISOString()), f2: new FormControl(dateTwo.toISOString())});
      const validator = FimsValidators.matchRange('f1', 'f2');
      expect(validator(group)).toBeNull();
    });

    it('should return error when range not correct', () => {
      const group = new FormGroup({f1: new FormControl(dateOne.toISOString()), f2: new FormControl(dateTwo.toISOString())});
      const validator = FimsValidators.matchRange('f2', 'f1');
      expect(validator(group)).toEqual({
        rangeInvalid: true
      });
    })
  });

  describe('email', () => {
    it('should return null when email is correct', () => {
      const result = FimsValidators.email(new FormControl('test@test.de'));
      expect(result).toBeNull();
    });

    it('should return error when email is "testtest.de"', () => {
      const result = FimsValidators.email(new FormControl('testtest.de'));
      expect(result).toEqual({
        email: true
      });
    })
  })
});
