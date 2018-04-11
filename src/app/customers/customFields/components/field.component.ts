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
import {FormArray, FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DataTypeOption, dataTypes} from '../domain/datatype-types.model';

@Component({
  selector: 'fims-custom-field-form',
  templateUrl: './field.component.html'
})
export class FieldFormComponent implements OnChanges {

  @Input() form: FormGroup;

  @Input() editMode: boolean;

  @Output('onAddOption') onAddOption = new EventEmitter<void>();

  @Output('onRemoveOption') onRemoveOption = new EventEmitter<number>();

  dataTypeOptions: DataTypeOption[] = dataTypes;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form) {
      this.form.get('dataType').valueChanges
        .subscribe(dataType => this.toggleDataType());

      this.toggleDataType();
    }
  }

  private toggleDataType(): void {
    const dataType = this.form.get('dataType').value;

    const lengthControl = this.form.get('length');
    const precisionControl = this.form.get('precision');
    const minValueControl = this.form.get('minValue');
    const maxValueControl = this.form.get('maxValue');
    const optionsControl = this.form.get('options');

    lengthControl.disable();
    precisionControl.disable();
    minValueControl.disable();
    maxValueControl.disable();
    optionsControl.disable();

    switch (dataType) {
      case 'TEXT': {
        if (!this.editMode) {
          lengthControl.enable();
        }
        break;
      }

      case 'NUMBER': {
        if (!this.editMode) {
          precisionControl.enable();
          minValueControl.enable();
          maxValueControl.enable();
        }
        break;
      }

      case 'SINGLE_SELECTION':
      case 'MULTI_SELECTION': {
        optionsControl.enable();
        break;
      }

      default:
        break;
    }
  }

  addOption(): void {
    this.onAddOption.emit();
  }

  removeOption(index: number): void {
    this.onRemoveOption.emit(index);
  }

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

}
