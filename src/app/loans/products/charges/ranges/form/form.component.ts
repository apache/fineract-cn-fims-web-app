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
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BalanceSegmentSet} from '../../../../../services/portfolio/domain/balance-segment-set.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';

@Component({
  selector: 'fims-product-charge-range-form-component',
  templateUrl: './form.component.html'
})
export class ProductChargeRangeFormComponent {

  form: FormGroup;

  @Input() set balanceSegmentSet(balanceSegmentSet: BalanceSegmentSet) {
    this.form = this.formBuilder.group({
      identifier: [balanceSegmentSet.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      ranges: this.initRanges(balanceSegmentSet)
    })
  };

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<BalanceSegmentSet>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  private initRanges(balanceSegmentSet: BalanceSegmentSet): FormArray {
    const formControls: FormGroup[] = [];
    const segments = balanceSegmentSet.segments;
    const segmentIdentifier = balanceSegmentSet.segmentIdentifiers;

    for(let i = 0; i < segments.length; i++) {
      const identifier = segmentIdentifier[i];
      const segment = segments[i];

      formControls.push(this.initRange(identifier, segment, i === 0));
    }

    return this.formBuilder.array(formControls);
  }

  private initRange(identifier: string = '', segment: number = 0, disabled: boolean = false): FormGroup {
    return this.formBuilder.group({
      identifier: [identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      segment: [{ value: segment, disabled }, [Validators.required, FimsValidators.minValue(0)]],
    })
  }

  addRange(): void {
    const ranges: FormArray = this.form.get('ranges') as FormArray;
    ranges.push(this.initRange());
  }

  removeRange(index: number): void {
    const ranges: FormArray = this.form.get('ranges') as FormArray;
    ranges.removeAt(index);
  }

  get ranges(): AbstractControl[] {
    const ranges: FormArray = this.form.get('ranges') as FormArray;
    return ranges.controls;
  }

  getFormGroup(index: number): FormGroup {
    const ranges = this.form.get('ranges') as FormArray;
    return ranges.at(index) as FormGroup;
  }

  getNextSegmentValue(index: number): string {
    const ranges = this.form.get('ranges') as FormArray;

    const nextIndex = index + 1;

    if(nextIndex >= ranges.length) return '-';

    const formGroup: FormGroup = this.getFormGroup(nextIndex);
    return formGroup.get('segment').value;
  }

  save(): void {
    const formValue = this.form.getRawValue();

    const segments: number[] = [];
    const segmentIdentifiers: string[] = [];

    formValue.ranges.forEach(range => {
      segments.push(range.segment);
      segmentIdentifiers.push(range.identifier);
    });

    const balanceSegmentSet: BalanceSegmentSet = {
      identifier: formValue.identifier,
      segments,
      segmentIdentifiers
    };

    this.onSave.emit(balanceSegmentSet)
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
