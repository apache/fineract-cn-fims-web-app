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
import {CreditWorthinessFactor} from '../../../../../services/portfolio/domain/individuallending/credit-worthiness-factor.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';
import {FormComponent} from '../../../../../common/forms/form.component';


@Component({
  selector: 'fims-case-credit-factor-form',
  templateUrl: './credit-factor.component.html'
})
export class CaseCreditFactorFormComponent extends FormComponent<CreditWorthinessFactor[]> implements OnInit {

  @Input() factors: CreditWorthinessFactor[];

  @Input() factorName: string;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      factors: this.initFactors(this.factors)
    });
  }

  get formData(): CreditWorthinessFactor[] {
    return this.formFactors.value;
  }

  private initFactors(factors: CreditWorthinessFactor[]): FormArray {
    const formControls: FormGroup[] = [];
    factors.forEach(factor => formControls.push(this.initFactor(factor)));
    return this.formBuilder.array(formControls);
  }

  private initFactor(factor?: CreditWorthinessFactor): FormGroup {
    return this.formBuilder.group({
      description: [factor ? factor.description : ''],
      amount: [factor ? factor.amount : 0, [ Validators.required, FimsValidators.minValue(0)] ]
    })
  }

  get formFactors(): FormArray {
    return this.form.get('factors') as FormArray;
  }

  addFactor(): void {
    this.formFactors.push(this.initFactor());
  }

  removeFactor(index: number): void {
    this.formFactors.removeAt(index);
  }

  get factorControls(): AbstractControl[] {
    return this.formFactors.controls;
  }
}
