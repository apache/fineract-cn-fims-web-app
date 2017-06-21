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

import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormComponent} from '../../../../../common/forms/form.component';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';
import {ChronoUnit} from '../../../../../services/portfolio/domain/chrono-unit.model';
import {alignmentOptions} from '../../../../../common/domain/alignment.model';
import {weekDayOptions} from '../../../../../common/domain/week-days.model';
import {monthOptions} from '../../../../../common/domain/months.model';
import {temporalOptionList} from '../../../../../common/domain/temporal.domain';
import {Product} from '../../../../../services/portfolio/domain/product.model';
import {Subscription} from 'rxjs/Subscription';

export interface DetailFormData {
  identifier: string,
  productIdentifier: string,
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
export class CaseDetailFormComponent extends FormComponent<DetailFormData> implements OnInit, OnDestroy, OnChanges {

  private productIdentifierChangeSubscription: Subscription;

  private _formData: DetailFormData;

  @Input() editMode: boolean;

  @Input() products: Product[];

  @Input() set formData(formData: DetailFormData) {
    this._formData = formData;
  };

  product: Product;

  alignments: any[] = alignmentOptions;

  monthDays: any[] = [];

  weekDays: any[] = weekDayOptions;

  months: any[] = monthOptions;

  temporalOptions = temporalOptionList;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    for(let i = 0; i < 30; i++) {
      this.monthDays.push({
        type: i, label: `${i+1}.`
      })
    }

    this.form = this.formBuilder.group({
      identifier: [this._formData.identifier, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe()]],
      productIdentifier: [this._formData.productIdentifier, [Validators.required]],
      principalAmount: [this._formData.principalAmount],
      term: [this._formData.term],
      termTemporalUnit: [this._formData.termTemporalUnit, Validators.required],
      paymentTemporalUnit: [this._formData.paymentTemporalUnit, [ Validators.required, FimsValidators.minValue(1) ]],
      paymentPeriod: [this._formData.paymentPeriod, [ Validators.required, FimsValidators.minValue(1)]],
      alignmentDay: [this._formData.paymentAlignmentDay],
      alignmentWeek: [this._formData.paymentAlignmentWeek],
      alignmentMonth: [this._formData.paymentAlignmentMonth],
      alignmentDaySetting: [this._formData.paymentAlignmentWeek ? 'relative' : 'fixed'],
    });

    this.productIdentifierChangeSubscription = this.form.get('productIdentifier').valueChanges
      .map(identifier => this.products.find(product => product.identifier === identifier))
      .subscribe(product => this.toggleProduct(product));
  }

  ngOnDestroy(): void {
    this.productIdentifierChangeSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.products && changes.products.currentValue && this._formData.productIdentifier) {
      const product = this.products.find(product => product.identifier === this._formData.productIdentifier);
      this.toggleProduct(product);
    }
  }

  toggleProduct(product: Product) {
    this.product = product;
    // Override validator with product constraints
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

  get formData(): DetailFormData {
    const isRelative: boolean = this.form.get('alignmentDaySetting').value === 'relative';

    const formData: DetailFormData = {
      identifier: this.form.get('identifier').value,
      productIdentifier: this.form.get('productIdentifier').value,
      principalAmount: this.form.get('principalAmount').value,
      term: this.form.get('term').value,
      termTemporalUnit: this.form.get('termTemporalUnit').value,
      paymentTemporalUnit: this.form.get('paymentTemporalUnit').value,
      paymentPeriod: this.form.get('paymentPeriod').value,
      paymentAlignmentDay: this.form.get('alignmentDay').value,
      paymentAlignmentWeek: isRelative ? this.form.get('alignmentWeek').value : undefined,
      paymentAlignmentMonth: isRelative ? this.form.get('alignmentMonth').value : undefined
    };
    return formData;
  }

}
