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
import {FormComponent} from '../../../../../common/forms/form.component';
import {Validators, FormBuilder} from '@angular/forms';
import {ChronoUnit} from '../../../../../services/portfolio/domain/chrono-unit.model';
import {temporalOptionList} from '../../../../../common/domain/temporal.domain';
import {FimsValidators} from '../../../../../common/validator/validators';

export interface TermRangeFormData{
  temporalUnit: ChronoUnit;
  term: number;
}

@Component({
  selector: 'fims-product-term-form',
  templateUrl: './term.component.html'
})
export class ProductTermFormComponent extends FormComponent<TermRangeFormData>{

  temporalOptions = temporalOptionList;

  @Input() set formData(termRange: TermRangeFormData){
    this.form = this.formBuilder.group({
      term: [termRange.term, [ Validators.required, FimsValidators.minValue(0) ]],
      temporalUnit: [termRange.temporalUnit, Validators.required],
    });
  };

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): TermRangeFormData{
    return this.form.getRawValue();
  }

}
