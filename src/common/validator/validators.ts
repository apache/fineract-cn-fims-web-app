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

import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export class FimsValidators {

  static urlSafe(control: AbstractControl): ValidationErrors | null {
    if (control.value && encodeURIComponent(control.value) !== control.value) {
      return {
        urlSafe: true
      };
    }
    return null;
  }

  static isNumber(control: AbstractControl): ValidationErrors | null {
    if (control.value && isNaN(control.value)) {
      return {
        isNumber: true
      };
    }
    return null;
  }

  static scale(scale: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c.value != null) {
        const stringValue = String(c.value);

        const valueChunks = stringValue.split('.');

        if(valueChunks.length == 1 && scale === 0) return null;

        if (valueChunks.length == 2 && valueChunks[1].length === scale) return null;

        return {
          scale: {
            valid: false,
            value: scale
          }
        };

      }
      return null;
    }
  }

  static maxScale(scale: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c.value != null) {
        const stringValue = String(c.value);
        const valueChunks = stringValue.split('.');

        if (valueChunks.length == 2 && valueChunks[1].length > scale) {
          return {
            maxScale: true
          };
        }
      }
      return null;
    }
  }

  static minValue(minValue: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
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
    return (c: AbstractControl): ValidationErrors | null => {
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
    return (group: FormGroup): ValidationErrors | null => {
      const firstNumber: number = Number(group.controls[firstValue].value);
      const secondNumber: number = Number(group.controls[secondValue].value);

      if(firstNumber == null || secondNumber == null) return null;

      if (firstNumber >= secondNumber) {
        return {
          greaterThan: true
        };
      }

      return null;
    }
  }

  static matchValues(firstValue: string, secondValue: string) {
    return (group: FormGroup): ValidationErrors | null => {
      const val1 = group.controls[firstValue];
      const val2 = group.controls[secondValue];

      if (val1.value !== val2.value) {
        return {
          mismatch: true
        };
      }

      return null;
    }
  }

  static matchRange(firstValue: string, secondValue: string) {
    return (group: FormGroup): ValidationErrors | null => {
      const val1 = group.controls[firstValue];
      const val2 = group.controls[secondValue];

      const dateStart: number = Date.parse(val1.value);
      const dateEnd: number = Date.parse(val2.value);

      if (dateStart > dateEnd) {
        return {
          rangeInvalid: true
        };
      }

      return null;
    }
  }

  static email(control: AbstractControl): ValidationErrors | null {
    if(control.value == null || control.value.length === 0) {
      return null;
    }

    return EMAIL_REGEXP.test(control.value) ? null : {'email': true};
  }

  static maxFileSize(maxSizeInKB: number) {
    return (c: AbstractControl): ValidationErrors | null => {
      const bytes = maxSizeInKB * 1024;
      if (c.value != null && (c.value.size > bytes)) {
        return {
          maxFileSize: {
            value: maxSizeInKB
          }
        }
      }
      return null;
    }
  }
}
