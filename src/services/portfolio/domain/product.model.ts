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

import {BalanceRange} from './balance-range.model';
import {InterestRange} from './interest-range.model';
import {TermRange} from './term-range.model';
import {InterestBasis} from './interest-basis.model';
import {AccountAssignment} from './account-assignment.model';
import {ProductParameters} from './individuallending/product-parameters.model';

export interface Product{
  identifier: string;
  name: string;
  termRange: TermRange;
  balanceRange: BalanceRange;
  interestRange: InterestRange;
  interestBasis: InterestBasis;
  patternPackage: string;
  description: string;
  accountAssignments: AccountAssignment[];
  parameters: string;
  currencyCode: string;
  minorCurrencyUnitDigits: number;
  enabled?: boolean;
}
