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

import {Component, Input, OnInit} from '@angular/core';
import {BalanceSegmentSet} from '../../../../../services/portfolio/domain/balance-segment-set.model';
import {FormControl} from '@angular/forms';

@Component({
  templateUrl: './range.component.html'
})
export class ProductChargeRangeFormComponent implements OnInit {

  formControl: FormControl;

  segmentSet: BalanceSegmentSet;

  @Input() selectedSegmentSet: string;

  @Input() balanceSegmentSets: BalanceSegmentSet[];

  constructor() {}

  ngOnInit(): void {
    this.formControl.valueChanges
      .subscribe(identifier => this.toggleBalanceSegment(identifier));
  }

  toggleBalanceSegment(identifier: string): void {
    this.segmentSet = this.balanceSegmentSets.find(segment => segment.identifier === identifier);
  }
}
