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
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormComponent} from '../../../../common/forms/form.component';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {ChronoUnit} from '../../../../services/portfolio/domain/chrono-unit.model';
import {alignmentOptions} from '../../../../common/domain/alignment.model';
import {weekDayOptions} from '../../../../common/domain/week-days.model';
import {monthOptions} from '../../../../common/domain/months.model';
import {temporalOptionList} from '../../../../common/domain/temporal.domain';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {maxPayment, maxTerm} from './validator/max-term.validators';

export interface DetailFormData {
  identifier: string;
  productIdentifier: string;
  interest: string;
  principalAmount: string;
  term: number;
  termTemporalUnit: ChronoUnit;
  paymentTemporalUnit: ChronoUnit;
  paymentPeriod: number;
  paymentAlignmentDay: number;
  paymentAlignmentWeek: number;
  paymentAlignmentMonth: number;
  depositAccountIdentifier: string;
}

type MonthSetting = 'DAY' | 'WEEK_AND_DAY';

@Component({
  selector: 'fims-case-detail-form',
  templateUrl: './detail.component.html'
})
export class CaseDetailFormComponent extends FormComponent<DetailFormData> implements OnInit, OnChanges {

  private _formData: DetailFormData;

  numberFormat = '1.2-2';

  @Input() editMode: boolean;

  @Input() products: Product[];

  @Input() productInstances: ProductInstance[];

  @Input() set formData(formData: DetailFormData) {
    this._formData = formData;
  };

  product: Product;

  weekAlignments: any[] = alignmentOptions;

  monthDays: any[] = [];

  weekDays: any[] = weekDayOptions;

  months: any[] = monthOptions;

  temporalOptions = temporalOptionList;

  displayDaysInWeek: boolean;

  displayMonthSetting: boolean;

  displayMonths: boolean;

  constructor(private formBuilder: FormBuilder) {
    super();

    this.form = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      productIdentifier: ['', [Validators.required]],
      interest: ['', [Validators.required]],
      principalAmount: [''],
      term: ['', [ Validators.required, FimsValidators.minValue(1), FimsValidators.maxScale(0)]],
      termTemporalUnit: ['', Validators.required],
      paymentTemporalUnit: ['', [ Validators.required ]],
      paymentPeriod: ['', [ Validators.required, FimsValidators.minValue(1), FimsValidators.maxScale(0)]],

      dayInWeek: ['', Validators.required],

      monthSetting: ['', Validators.required],

      monthSettingDay: ['', Validators.required],
      monthSettingDayInWeek: ['', Validators.required],
      monthSettingWeek: ['', Validators.required],

      month: ['', Validators.required],

      depositAccountIdentifier: ['', Validators.required]
    });

    this.form.get('productIdentifier').valueChanges
      .filter(() => !!this.products)
      .map(identifier => this.products.find(product => product.identifier === identifier))
      .subscribe(product => this.toggleProduct(product));

    this.form.get('paymentTemporalUnit').valueChanges
      .subscribe(unit => this.toggleTemporalUnit(unit));

    this.form.get('monthSetting').valueChanges
      .subscribe(setting => this.toggleMonthSetting(setting));
  }

  ngOnInit(): void {
    for (let i = 0; i < 30; i++) {
      this.monthDays.push({
        type: i, label: `${i + 1}.`
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formData) {
      this.form.reset({
        identifier: this._formData.identifier,
        productIdentifier: this._formData.productIdentifier,
        interest: this._formData.interest,
        principalAmount: this._formData.principalAmount,
        term: this._formData.term,
        termTemporalUnit: this._formData.termTemporalUnit,
        paymentTemporalUnit: this._formData.paymentTemporalUnit,
        paymentPeriod: this._formData.paymentPeriod,

        dayInWeek: this._formData.paymentAlignmentDay,

        monthSetting: this._formData.paymentAlignmentWeek != null ? 'WEEK_AND_DAY' : 'DAY',

        monthSettingDay: this._formData.paymentAlignmentDay,
        monthSettingDayInWeek: this._formData.paymentAlignmentDay,
        monthSettingWeek: this._formData.paymentAlignmentWeek,

        month: this._formData.paymentAlignmentMonth,

        depositAccountIdentifier: this._formData.depositAccountIdentifier
      });
    }

    if (changes.products && changes.products.currentValue && this._formData.productIdentifier) {
      const foundProduct = this.products.find(product => product.identifier === this._formData.productIdentifier);
      this.toggleProduct(foundProduct);
    }
  }

  private toggleProduct(product: Product) {
    this.product = product;

    // Override validator with product constraints
    const principalAmount = this.form.get('principalAmount') as FormControl;
    this.toggleDisabledState(principalAmount, product.balanceRange.minimum, product.balanceRange.maximum, product.minorCurrencyUnitDigits);

    const interest: FormControl = this.form.get('interest') as FormControl;
    this.toggleDisabledState(interest, product.interestRange.minimum, product.interestRange.maximum, product.minorCurrencyUnitDigits);

    this.form.setValidators([maxTerm(product.termRange), maxPayment()]);
  }

  private toggleDisabledState(formControl: FormControl, minimum: number, maximum: number, maxScale: number): void {
    const hasRange: boolean = minimum !== maximum;

    if (hasRange) {
      formControl.enable();
      formControl.setValidators([
        Validators.required,
        FimsValidators.minValue(minimum),
        FimsValidators.maxValue(maximum)
      ]);
    } else {
      formControl.setValue(minimum.toFixed(maxScale));
      formControl.disable();
    }

    formControl.updateValueAndValidity();
  }

  toggleTemporalUnit(chronoUnit: ChronoUnit): void {
    const dayInWeek = this.form.get('dayInWeek');
    const month = this.form.get('month');

    if (chronoUnit === 'WEEKS') {
      this.enableMonthSetting(false);
      dayInWeek.enable();
      month.disable();

      this.displayDaysInWeek = true;
      this.displayMonths = false;
    } else if (chronoUnit === 'MONTHS') {
      this.enableMonthSetting(true);
      dayInWeek.disable();
      month.disable();

      this.displayDaysInWeek = false;
      this.displayMonths = false;
    } else {
      this.enableMonthSetting(true);
      dayInWeek.disable();
      month.enable();

      this.displayDaysInWeek = false;
      this.displayMonths = true;
    }
  }

  enableMonthSetting(enable: boolean): void {
    const monthSetting = this.form.get('monthSetting');
    const monthSettingDay = this.form.get('monthSettingDay');
    const monthSettingDayInWeek = this.form.get('monthSettingDayInWeek');
    const monthSettingWeek = this.form.get('monthSettingWeek');

    if (enable) {
      this.displayMonthSetting = true;
      monthSetting.enable();
    } else {
      this.displayMonthSetting = false;
      monthSetting.disable();
      monthSettingDay.disable();
      monthSettingDayInWeek.disable();
      monthSettingWeek.disable();
    }
  }

  toggleMonthSetting(setting: MonthSetting): void {
    const monthSettingDay = this.form.get('monthSettingDay');
    const monthSettingDayInWeek = this.form.get('monthSettingDayInWeek');
    const monthSettingWeek = this.form.get('monthSettingWeek');

    if (setting === 'DAY') {
      monthSettingDay.enable();
      monthSettingDayInWeek.disable();
      monthSettingWeek.disable();
    } else {
      monthSettingDay.disable();
      monthSettingDayInWeek.enable();
      monthSettingWeek.enable();
    }
  }

  get formData(): DetailFormData {
    const paymentTemporalUnit = this.form.get('paymentTemporalUnit').value;
    const dayInWeek = this.form.get('dayInWeek').value;

    const monthSetting: MonthSetting = this.form.get('monthSetting').value;
    const monthSettingDay = this.form.get('monthSettingDay').value;
    const monthSettingDayInWeek = this.form.get('monthSettingDayInWeek').value;
    const monthSettingWeek = this.form.get('monthSettingWeek').value;
    const month = this.form.get('month').value;

    let paymentAlignmentDay: number;
    let paymentAlignmentWeek: number;
    let paymentAlignmentMonth: number;

    if (paymentTemporalUnit === 'WEEKS') {
      paymentAlignmentDay = dayInWeek;
    }

    if (paymentTemporalUnit === 'MONTHS' || paymentTemporalUnit === 'YEARS') {
      if (monthSetting === 'DAY') {
        paymentAlignmentDay = monthSettingDay;
      } else {
        paymentAlignmentDay = monthSettingDayInWeek;
        paymentAlignmentWeek = monthSettingWeek;
      }
    }

    if (paymentTemporalUnit === 'YEARS') {
      paymentAlignmentMonth = month;
    }

    const formData: DetailFormData = {
      identifier: this.form.get('identifier').value,
      productIdentifier: this.form.get('productIdentifier').value,
      interest: this.form.get('interest').value,
      principalAmount: this.form.get('principalAmount').value,
      term: this.form.get('term').value,
      termTemporalUnit: this.form.get('termTemporalUnit').value,
      paymentTemporalUnit,
      paymentPeriod: this.form.get('paymentPeriod').value,
      paymentAlignmentDay,
      paymentAlignmentWeek,
      paymentAlignmentMonth,
      depositAccountIdentifier: this.form.get('depositAccountIdentifier').value
    };

    return formData;
  }

  showIdentifierValidationError(): void {
    this.setError('identifier', 'unique', true);
  }

}
