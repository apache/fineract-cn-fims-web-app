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
import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AdjustmentOption} from '../model/adjustment-option.model';

@Component({
  selector: 'fims-teller-adjustment-form',
  templateUrl: './adjustment.component.html'
})
export class AdjustmentComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() adjustmentOptions: AdjustmentOption[];

  ngOnInit(): void {
    this.form.get('adjustment').valueChanges
      .startWith(this.form.get('adjustment').value)
      .subscribe(adjustment => {
        const amountControl = this.form.get('amount');
        if (adjustment === 'NONE') {
          amountControl.disable();
        } else {
          amountControl.enable();
        }
      });
  }
}
