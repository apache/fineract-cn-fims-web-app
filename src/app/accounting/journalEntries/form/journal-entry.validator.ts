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

import {FormArray, FormGroup} from '@angular/forms';

export class JournalEntryValidators {

  static minItems(min: number = 1) {
    return (formArray: FormArray): {[key: string]: any} => {
      const minLength = min -1;
      if (formArray.length <= minLength) {
        return {
          minItemsInvalid: true
        };
      }

      return null;
    }
  }

  static equalSum(firstValue: string, secondValue: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const firstSum: number = this.sum(group.get(firstValue).value);

      const secondSum: number = this.sum(group.get(secondValue).value);

      if (firstSum !== secondSum) {
        return {
          sumInvalid: true
        };
      }

      return null;
    }
  }

  private static sum(accounts: any[]): number {
    let sum = 0;

    for(let account of accounts){
      sum += account.amount;
    }

    return sum;
  }

}
