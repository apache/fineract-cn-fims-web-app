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

import {FormComponent} from '../../../../../common/forms/form.component';
import {Component, Input} from '@angular/core';
import {Moratorium} from '../../../../../services/portfolio/domain/individuallending/moratorium.model';
import {FormArray, FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {temporalOptionList} from '../../../../../common/domain/temporal.domain';

@Component({
  selector: 'fims-product-moratorium-form',
  templateUrl: './moratorium.component.html'
})
export class ProductMoratoriumFormComponent extends FormComponent<Moratorium[]>{

  temporalOptions = temporalOptionList;

  @Input('formData') set formData(moratoriums: Moratorium[]){
    moratoriums = moratoriums || [];
    this.form = this.formBuilder.group({
      moratoriums: this.initMoratoriums(moratoriums),
    });
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): Moratorium[] {
    return null;
  }

  private initMoratoriums(moratoriums: Moratorium[]): FormArray {
    const formControls: FormGroup[] = [];
    moratoriums.forEach(value => formControls.push(this.initMoratorium(value)));
    return this.formBuilder.array(formControls);
  }

  private initMoratorium(moratorium?: Moratorium): FormGroup {
    return this.formBuilder.group({
      period: [moratorium ? moratorium.period : '1', Validators.required],
      chargeTask: [moratorium ? moratorium.chargeTask : '', Validators.required],
      temporalUnit: [moratorium ? moratorium.temporalUnit : 'WEEKS', Validators.required]
    })
  }

  addMoratorium(): void {
    const moratoriums: FormArray = this.form.get('moratoriums') as FormArray;
    moratoriums.push(this.initMoratorium());
  }

  removeMoratorium(index: number): void {
    const moratoriums: FormArray = this.form.get('moratoriums') as FormArray;
    moratoriums.removeAt(index);
  }

  get moratoriums(): AbstractControl[] {
    const moratoriums: FormArray = this.form.get('moratoriums') as FormArray;
    return moratoriums.controls;
  }
}
