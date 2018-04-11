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
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Injectable} from '@angular/core';
import {Field} from '../../../services/catalog/domain/field.model';
import {Option} from '../../../services/catalog/domain/option.model';
import {FimsValidators} from '../../../common/validator/validators';
import {optionValueUnique} from './option-value-unique.validator';

@Injectable()
export class FieldFormService {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      identifier: ['', [Validators.required]],
      dataType: ['', [Validators.required]],
      label: ['', [Validators.required, Validators.maxLength(256)]],
      hint: ['', [Validators.maxLength(512)]],
      description: ['', [Validators.maxLength(4096)]],
      mandatory: [''],
      length: ['', [FimsValidators.minValue(1), FimsValidators.maxScale(0)]],
      precision: ['', [FimsValidators.minValue(0), FimsValidators.maxScale(0)]],
      minValue: ['', [FimsValidators.minValue(0)]],
      maxValue: ['', [FimsValidators.minValue(1)]],
      options: this.formBuilder.array([], optionValueUnique)
    });
  }

  resetForm(form: FormGroup, field: Field): void {
    form.reset({
      identifier: field ? field.identifier : '',
      dataType: field ? field.dataType : 'TEXT',
      label: field ? field.label : '',
      hint: field ? field.hint : '',
      description: field ? field.description : '',
      mandatory: field ? field.mandatory : false,
      length: field ? field.length : 1,
      precision: field ? field.precision : 0,
      minValue: field ? field.minValue : 0,
      maxValue: field ? field.maxValue : 1
    });

    if (field && field.options) {
      field.options.forEach(option => this.addOption(form, option));
    }
  }

  initOption(option?: Option): FormGroup {
    return this.formBuilder.group({
      label: [option ? option.label : '', [Validators.required, Validators.maxLength(256)]],
      value: [option ? option.value : '', [Validators.required, FimsValidators.minValue(0)]]
    });
  }

  addOption(form: FormGroup, option?: Option): void {
    const options: FormArray = form.get('options') as FormArray;
    options.push(this.initOption(option));
  }

  removeOption(form: FormGroup, index: number): void {
    const options: FormArray = form.get('options') as FormArray;
    options.removeAt(index);
  }
}
