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
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';
import {FimsRange} from '../../../../../services/portfolio/domain/range-model';

@Component({
  selector: 'fims-product-charge-range-form-component',
  templateUrl: './form.component.html'
})
export class ProductChargeRangeFormComponent {

  form: FormGroup;

  @Input() set range(range: FimsRange) {
    this.form = this.formBuilder.group({
      identifier: [range.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      rangeSegments: this.initRangeSegments(range)
    });

    // TODO: Validate unique identifier and ranges across range segments
  };

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<FimsRange>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  private initRangeSegments(range: FimsRange): FormArray {
    const formControls: FormGroup[] = [];

    range.segments.forEach((segment, index) => {
      formControls.push(this.initRange(segment.identifier, segment.start, index === 0));
    });

    return this.formBuilder.array(formControls);
  }

  private initRange(identifier: string = '', start: number = 0, disabled: boolean = false): FormGroup {
    return this.formBuilder.group({
      identifier: [identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      start: [{ value: start, disabled }, [Validators.required, FimsValidators.minValue(0)]],
      end: [{ value: 0, disabled: true }, [Validators.required, FimsValidators.minValue(0)]],
    });
  }

  get rangeSegments(): FormArray {
    return this.form.get('rangeSegments') as FormArray;
  }

  addRangeSegment(): void {
    this.rangeSegments.push(this.initRange());
  }

  removeRangeSegment(index: number): void {
    this.rangeSegments.removeAt(index);
  }

  get rangeSegmentControls(): AbstractControl[] {
    return this.rangeSegments.controls;
  }

  getFormGroup(index: number): FormGroup {
    return this.rangeSegments.at(index) as FormGroup;
  }

  getNextSegmentValue(index: number): string {
    const nextIndex = index + 1;

    if (nextIndex >= this.rangeSegments.length) {
      return '-';
    }

    const formGroup: FormGroup = this.getFormGroup(nextIndex);
    return formGroup.get('start').value;
  }

  save(): void {
    const formValue = this.form.getRawValue();

    const range: FimsRange = {
      identifier: formValue.identifier,
      segments: formValue.rangeSegments.map(segment => ({
        identifier: segment.identifier,
        start: segment.start,
        end: segment.end
      }))
    };

    this.onSave.emit(range);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
