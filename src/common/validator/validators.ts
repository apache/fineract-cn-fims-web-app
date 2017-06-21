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

import {FormGroup, ValidatorFn, AbstractControl} from '@angular/forms';

export class FimsValidators {

  static urlSafe(): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value && encodeURIComponent(c.value) !== c.value) {
          return {
            urlSafe: true
          };
      }
      return null;
    }
  }

  static isNumber(): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value && isNaN(c.value)) {
        return {
          isNumber: true
        };
      }
      return null;
    }
  }

  static precision(precision: number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value != null) {
        let stringValue = String(c.value);

        let valueChunks = stringValue.split('.');

        if(valueChunks.length == 1 && precision === 0) return null;

        if (valueChunks.length == 2 && valueChunks[1].length === precision) return null;

        return {
          precision: {
            valid: false,
            value: precision
          }
        };

      }
      return null;
    }
  }

  static maxPrecision(precision: number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value != null) {
        let stringValue = String(c.value);
        let valueChunks = stringValue.split('.');

        if (valueChunks.length == 2 && valueChunks[1].length > precision) {
          return {
            maxPrecision: true
          };
        }
      }
      return null;
    }
  }

  static minValue(minValue: number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value != null && (c.value < minValue)) {
        return {
          minValue: {
            valid: false,
            value: minValue
          }
        }
      }
      return null;
    }
  }

  static maxValue(maxValue: number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value != null && (c.value > maxValue)) {
        return {
          maxValue: {
            valid: false,
            value: maxValue
          }
        }
      }
      return null;
    }
  }

  static greaterThan(firstValue: string, secondValue: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let firstNumber: number = Number(group.controls[firstValue].value);
      let secondNumber: number = Number(group.controls[secondValue].value);

      if(firstNumber == null || secondNumber == null) return null;

      if (firstNumber >= secondNumber) {
        return {
          greaterThan: true
        };
      }
    }
  }

  static matchValues(firstValue: string, secondValue: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let val1 = group.controls[firstValue];
      let val2 = group.controls[secondValue];

      if (val1.value !== val2.value) {
        return {
          mismatch: true
        };
      }
    }
  }

  static matchRange(firstValue: string, secondValue: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let val1 = group.controls[firstValue];
      let val2 = group.controls[secondValue];

      let dateStart: number = Date.parse(val1.value);
      let dateEnd: number = Date.parse(val2.value);

      if (dateStart > dateEnd) {
        return {
          rangeInvalid: true
        };
      }

      return null;
    }
  }
}
