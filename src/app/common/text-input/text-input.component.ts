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
import {Component, HostBinding, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'fims-text-input',
  templateUrl: './text-input.component.html'
})
export class TextInputComponent {

  @HostBinding('attr.layout')
  @Input() layout = 'row';

  @Input() placeholder: string;

  @Input() controlName: string;

  @Input() form: FormGroup;

  @Input() type: string;

  @Input() hideIfDisabled = false;

  @Input() title = '';

  get hasRequiredError(): boolean {
    return this.hasError('required');
  }

  get hasMinLengthError(): boolean {
    return this.hasError('minlength');
  }

  get hasMaxLengthError(): boolean {
    return this.hasError('maxlength');
  }

  get hasEmailError(): boolean {
    return this.hasError('email');
  }

  get hasIsNumberError(): boolean {
    return this.hasError('isNumber');
  }

  get hasMinValueError(): boolean {
    return this.hasError('minValue');
  }

  get hasMaxValueError(): boolean {
    return this.hasError('maxValue');
  }

  get hasGreaterThanValueError(): boolean {
    return this.hasError('greaterThanValue');
  }

  get hasMaxScaleError(): boolean {
    return this.hasError('maxScale');
  }

  hasError(key: string): boolean {
    return this.form.get(this.controlName).hasError(key);
  }

  get show(): boolean {
    if (this.hideIfDisabled) {
      return this.form.get(this.controlName).status !== 'DISABLED';
    }

    return true;
  }
}
