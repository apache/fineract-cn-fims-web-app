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
      return null;
    }

    const maxValues = getMaxValues(termRange.temporalUnit, termRange.maximum);

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

export function maxPayment(): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    const term: number = parseInt(group.get('term').value, 10);
    const termTemporalUnit = group.get('termTemporalUnit').value;

    const paymentPeriod: number = parseInt(group.get('paymentPeriod').value, 10);
    const paymentTemporalUnit = group.get('paymentTemporalUnit').value;

    if (isEmptyInputValue(term) || isEmptyInputValue(paymentPeriod)) {
      return null;
    }

    const maxValues = getMaxValues(termTemporalUnit, term);

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

function getMaxValues(temporalUnit: ChronoUnit, maximum: number): MaxValues {

  const weekBase = 52;
  const monthBase = 12;

  let maxWeeks = 0;
  let maxMonths = 0;
  let maxYears = 0;

  switch (temporalUnit) {
    case 'WEEKS': {
      maxWeeks = maximum;
      maxMonths = (maximum * monthBase) / weekBase;
      maxYears = maximum / weekBase;
      break;
    }

    case 'MONTHS': {
      maxWeeks = (maximum * weekBase) / monthBase;
      maxMonths = maximum;
      maxYears = maximum / monthBase;
      break;
    }

    case 'YEARS': {
      maxWeeks = maximum * weekBase;
      maxMonths = maximum * monthBase;
      maxYears = maximum;
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
