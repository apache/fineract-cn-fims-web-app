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
import {FormComponent} from '../../../../../components/forms/form.component';
import {Validators, FormBuilder, FormControl} from '@angular/forms';
import {FimsValidators} from '../../../../../components/validator/validators';
import {ChronoUnit} from '../../../../../services/portfolio/domain/chrono-unit.model';
import {alignmentOptions} from '../../../../../components/domain/alignment.model';
import {weekDayOptions} from '../../../../../components/domain/week-days.model';
import {monthOptions} from '../../../../../components/domain/months.model';
import {temporalOptionList} from '../../../../../components/domain/temporal.domain';
import {Product} from '../../../../../services/portfolio/domain/product.model';

export interface DetailFormData{
  identifier: string,
  principalAmount: number,
  term: number,
  termTemporalUnit: ChronoUnit,
  paymentTemporalUnit: ChronoUnit,
  paymentPeriod: number,
  paymentAlignmentDay: number,
  paymentAlignmentWeek: number,
  paymentAlignmentMonth: number
}

@Component({
  selector: 'fims-case-detail-form',
  templateUrl: './detail.component.html'
})
export class CaseDetailFormComponent extends FormComponent<DetailFormData> implements OnInit{

  private _product: Product;

  alignments: any[] = alignmentOptions;

  monthDays: any[] = [];

  weekDays: any[] = weekDayOptions;

  months: any[] = monthOptions;

  temporalOptions = temporalOptionList;

  @Input() set formData(formData: DetailFormData) {
    this.form = this.formBuilder.group({
      identifier: [formData.identifier, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe()]],
      principalAmount: [formData.principalAmount],
      term: [formData.term],
      termTemporalUnit: [formData.termTemporalUnit, Validators.required],
      paymentTemporalUnit: [formData.paymentTemporalUnit, [ Validators.required, FimsValidators.minValue(1) ]],
      paymentPeriod: [formData.paymentPeriod, [ Validators.required, FimsValidators.minValue(1)]],
      alignmentDay: [formData.paymentAlignmentDay],
      alignmentWeek: [formData.paymentAlignmentWeek],
      alignmentMonth: [formData.paymentAlignmentMonth],
      alignmentDaySetting: [formData.paymentAlignmentWeek !== null ? 'relative' : 'fixed'],
    });
  }

  @Input() set product(product: Product) {
    this._product = product;

    if(!product) return;

    // Override validator with product constaints
    const principalAmount = this.form.get('principalAmount') as FormControl;
    principalAmount.setValidators([
      Validators.required,
      FimsValidators.minValue(product.balanceRange.minimum),
      FimsValidators.maxValue(product.balanceRange.maximum)
    ]);
    principalAmount.updateValueAndValidity();

    // pre set temporal unit from product
    const termTemporalUnit: FormControl = this.form.get('termTemporalUnit') as FormControl;
    termTemporalUnit.setValue(product.termRange.temporalUnit);
    termTemporalUnit.updateValueAndValidity();

    const term: FormControl = this.form.get('term') as FormControl;
    term.setValidators([
      Validators.required,
      FimsValidators.minValue(1),
      FimsValidators.maxValue(product.termRange.maximum)
    ]);
    term.updateValueAndValidity();
  }

  get product(): Product {
    return this._product;
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    for(let i = 0; i < 30; i++) {
      this.monthDays.push({
        type: i, label: `${i+1}.`
      })
    }
  }

  get formData(): DetailFormData {
    let formData: DetailFormData = {
      identifier: this.form.get('identifier').value,
      principalAmount: this.form.get('principalAmount').value,
      term: this.form.get('term').value,
      termTemporalUnit: this.form.get('termTemporalUnit').value,
      paymentTemporalUnit: this.form.get('paymentTemporalUnit').value,
      paymentPeriod: this.form.get('paymentPeriod').value,
      paymentAlignmentDay: this.form.get('alignmentDay').value,
      paymentAlignmentWeek: this.form.get('alignmentWeek').value,
      paymentAlignmentMonth: this.form.get('alignmentMonth').value
    };
    return formData;
  }

}
