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
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';
import {LossProvisionStep} from '../../../../services/portfolio/domain/loss-provision-step.model';
import {daysLateUnique} from './validator/days-late-unique.validator';

@Component({
  selector: 'fims-product-loss-provision-form',
  templateUrl: './form.component.html'
})
export class ProductLossProvisionFormComponent implements OnChanges {

  form: FormGroup;

  @Input() lossProvisionSteps: LossProvisionStep[];

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<LossProvisionStep[]>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      steps: this.initSteps([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lossProvisionSteps) {
      this.lossProvisionSteps.forEach(step => this.addStep(step));
    }
  }

  private initSteps(steps: LossProvisionStep[]): FormArray {
    const formControls: FormGroup[] = [];

    steps.forEach(step => {
      formControls.push(this.initStep(step));
    });

    return this.formBuilder.array(formControls, daysLateUnique);
  }

  private initStep(step?: LossProvisionStep): FormGroup {
    return this.formBuilder.group({
      daysLate: [step ? step.daysLate : 0, [Validators.required, FimsValidators.minValue(0)]],
      percentProvision: [step ? step.percentProvision : 0, [Validators.required, FimsValidators.minValue(0), FimsValidators.maxValue(100)]]
    });
  }

  addStep(step?: LossProvisionStep): void {
    const steps: FormArray = this.form.get('steps') as FormArray;
    steps.push(this.initStep(step));
  }

  removeStep(index: number): void {
    const steps: FormArray = this.form.get('steps') as FormArray;
    steps.removeAt(index);
  }

  get steps(): AbstractControl[] {
    const steps: FormArray = this.form.get('steps') as FormArray;
    return steps.controls;
  }

  save(): void {
    const formValue = this.form.getRawValue();

    const steps = formValue.steps.map(step => ({
      daysLate: parseInt(step.daysLate, 10),
      percentProvision: parseInt(step.percentProvision, 10)
    }));

    this.onSave.emit(steps);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
