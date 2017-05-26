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

import {ChronoUnit} from '../../services/portfolio/domain/chrono-unit.model';

export interface TemporalOption {
  label: string;
  type: ChronoUnit
}

export const temporalOptionList: TemporalOption[] = [
  { type: 'WEEKS', label: 'weeks'},
  { type: 'MONTHS', label: 'months'},
  { type: 'YEARS', label: 'years'}
];
