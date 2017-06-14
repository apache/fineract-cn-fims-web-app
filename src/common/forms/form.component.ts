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

import {AbstractControl, FormGroup} from '@angular/forms';

export abstract class FormComponent<T> {

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({});
  }

  abstract get formData(): T

  abstract set formData(data: T)

  get pristine(): boolean {
    if(!this.form) return true;
    return this.form.pristine;
  }

  get valid(): boolean {
    if(!this.form) return true;
    return this.form.valid;
  }

  get dirty(): boolean {
    if(!this.form) return true;
    return this.form.dirty;
  }

  /**
   * Checks if form is pristine before doing valid check
   * @returns {boolean}
   */
  get validWhenOptional(): boolean {
    if(!this.pristine && this.valid){
      return true;
    }else if(!this.pristine && !this.valid){
      return false;
    }
    return true;
  }

  setError(field: string, error: string, value: any): void {
    const control: AbstractControl = this.form.get(field);
    let errors = control.errors || {};
    errors[error] = value;
    control.setErrors(errors);
  }
}
