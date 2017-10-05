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
import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {isEmptyInputValue} from '../../../../../common/validator/validators';
import {TermRange} from '../../../../../services/portfolio/domain/term-range.model';
import {ChronoUnit} from '../../../../../services/portfolio/domain/chrono-unit.model';

interface MaxValues {
  maxWeeks: number;
  maxMonths: number;
  maxYears: number;
}

export function maxTerm(termRange: TermRange): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    const term: number = parseInt(group.get('term').value, 10);

    if (isEmptyInputValue(term)) {
      return;
    }

    const maxValues = getMaxValues(termRange);

    const termTemporalUnit = group.get('termTemporalUnit').value;

    if (!isValid(term, termTemporalUnit, maxValues)) {
      return {
        maxTerm: {
          maxWeeks: maxValues.maxWeeks,
          maxMonths: maxValues.maxMonths,
          maxYears: maxValues.maxYears
        },
      };
    }

    return null;
  };
}

export function maxPayment(termRange: TermRange): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    const paymentPeriod: number = parseInt(group.get('paymentPeriod').value, 10);

    if (isEmptyInputValue(paymentPeriod)) {
      return;
    }

    const maxValues = getMaxValues(termRange);

    const paymentTemporalUnit = group.get('paymentTemporalUnit').value;

    if (!isValid(paymentPeriod, paymentTemporalUnit, maxValues)) {
      return {
        maxPayment: {
          maxWeeks: maxValues.maxWeeks,
          maxMonths: maxValues.maxMonths,
          maxYears: maxValues.maxYears
        },
      };
    }

    return null;
  };
}

function isValid(term: number, temporalUnit: ChronoUnit, maxValues: MaxValues): boolean {

  let valid = false;

  switch (temporalUnit) {
    case 'WEEKS': {
      valid = term <= maxValues.maxWeeks;
      break;
    }

    case 'MONTHS': {
      valid = term <= maxValues.maxMonths;
      break;
    }

    case 'YEARS': {
      valid = term <= maxValues.maxYears;
      break;
    }

    default:
      break;
  }

  return valid;
}

function getMaxValues(termRange: TermRange): MaxValues {

  const weekBase = 52;

  let maxWeeks = 0;
  let maxMonths = 0;
  let maxYears = 0;

  switch (termRange.temporalUnit) {
    case 'WEEKS': {
      maxWeeks = termRange.maximum;
      maxMonths = (termRange.maximum * 12) / weekBase;
      maxYears = termRange.maximum / weekBase;
      break;
    }

    case 'MONTHS': {
      maxWeeks = (termRange.maximum * weekBase) / 12;
      maxMonths = termRange.maximum;
      maxYears = termRange.maximum / 12;
      break;
    }

    case 'YEARS': {
      maxWeeks = termRange.maximum * weekBase;
      maxMonths = termRange.maximum * 12;
      maxYears = termRange.maximum;
      break;
    }

    default:
      break;
  }

  return {
    maxWeeks: Math.floor(maxWeeks),
    maxMonths: Math.floor(maxMonths),
    maxYears: Math.floor(maxYears)
  };
}
