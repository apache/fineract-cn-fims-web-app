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
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormComponent} from '../../../../common/forms/form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {ChronoUnit} from '../../../../services/portfolio/domain/chrono-unit.model';
import {Currency} from '../../../../services/currency/domain/currency.model';
import {Error} from '../../../../services/domain/error.model';
import {TemporalOption} from '../../../../common/domain/temporal.domain';

export interface DetailFormData {
  identifier: string;
  name: string;
  description: string;
  currencyCode: string;
  minimumBalance: string;
  maximumBalance: string;
  term: number;
  temporalUnit: ChronoUnit;
}

@Component({
  selector: 'fims-product-detail-form',
  templateUrl: './detail.component.html'
})
export class ProductDetailFormComponent extends FormComponent<DetailFormData> implements OnChanges {

  private _formData: DetailFormData;

  @Input('formData') set formData(formData: DetailFormData) {
    this._formData = formData;
  };

  @Input('editMode') editMode: boolean;

  @Input('temporalOptions') temporalOptions: TemporalOption[];

  @Input('currencies') currencies: Currency[];

  @Input('error') error: Error;

  constructor(private formBuilder: FormBuilder) {
    super();

    this.form = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      description: ['', [Validators.required, Validators.maxLength(4096)]],
      currencyCode: ['', [Validators.required]],
      minimumBalance: ['', [Validators.required, FimsValidators.minValue(0)]],
      maximumBalance: ['', [Validators.required, FimsValidators.minValue(0)]],
      term: ['', [ Validators.required, FimsValidators.minValue(1), FimsValidators.maxScale(0)]],
      temporalUnit: ['', Validators.required]
    }, { validator: FimsValidators.greaterThanEquals('minimumBalance', 'maximumBalance') });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formData) {
      this.form.reset({
        identifier: this._formData.identifier,
        name: this._formData.name,
        description: this._formData.description,
        currencyCode: this._formData.currencyCode,
        minimumBalance: this._formData.minimumBalance,
        maximumBalance: this._formData.maximumBalance,
        term: this._formData.term,
        temporalUnit: this._formData.temporalUnit
      });
    }

    if (changes.error) {
      this.setError('identifier', 'unique', true);
    }
  }

  get formData(): DetailFormData {
    return this.form.getRawValue();
  }
}
