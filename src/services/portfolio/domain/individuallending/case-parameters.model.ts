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

import {TermRange} from '../term-range.model';
import {BalanceRange} from '../balance-range.model';
import {PaymentCycle} from '../payment-cycle.model';
import {CreditWorthinessSnapshot} from './credit-worthiness-snapshot.model';

export interface CaseParameters {
  customerIdentifier: string;
  termRange: TermRange;
  maximumBalance: number;
  paymentCycle: PaymentCycle;
  creditWorthinessSnapshots: CreditWorthinessSnapshot[];
}
