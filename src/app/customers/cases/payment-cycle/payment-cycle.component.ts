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

import {Component, Input} from '@angular/core';
import {temporalOptionList} from '../../../../common/domain/temporal.domain';
import {weekDayOptions} from '../../../../common/domain/week-days.model';
import {alignmentOptions} from '../../../../common/domain/alignment.model';
import {PaymentCycle} from '../../../../services/portfolio/domain/payment-cycle.model';
import {monthOptions} from '../../../../common/domain/months.model';

@Component({
  selector: 'fims-case-detail-payment-cycle',
  templateUrl: './payment-cycle.component.html'
})
export class CaseDetailPaymentCycleComponent {

  @Input() paymentCycle: PaymentCycle;

  get alignmentDaySetting(): string {
    return this.paymentCycle.alignmentWeek ? 'relative' : 'fixed';
  }

  getAlignment(id: number): any {
    return alignmentOptions.find(alignment => alignment.type === id);
  }

  getWeekDayOption(id: number): any {
    return weekDayOptions.find(weekDayOption => weekDayOption.type === id);
  }

  getMonthOption(id: number): any {
    return monthOptions.find(monthOption => monthOption.type === id);
  }

  getTemporalOption(id: string): any {
    return temporalOptionList.find(monthOption => monthOption.type === id);
  }
}
