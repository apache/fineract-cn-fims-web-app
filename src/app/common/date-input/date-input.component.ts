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
import { Component, Input, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fims-date-input',
  templateUrl: './date-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})
export class DateInputComponent implements ControlValueAccessor {

  @Input() placeholder;

  @Input() controlName;

  @Input() form: FormGroup;

  @Input() title = '';
  // @Input('value') _value = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  get hasRequiredError(): boolean {
    return this.hasError('required');
  }

  get hasBeforeTodayError(): boolean {
    return this.hasError('beforeToday');
  }

  get hasAfterTodayError(): boolean {
    return this.hasError('afterToday');
  }

  hasError(key: string): boolean {
    return this.form.get(this.controlName).hasError(key);
  }
  get value() {
    return this.controlName;
  }

  set value(val) {
    this.controlName = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() { }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(controlName) {
    if (controlName) {
      this.controlName = controlName;
    }
  }
}
