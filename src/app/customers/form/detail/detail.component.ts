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

import {Component, Input} from '@angular/core';
import {FormComponent} from '../../../../common/forms/form.component';
import {Validators, FormBuilder} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';

export interface CustomerDetailFormData {
  identifier: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
  member: boolean;
}

@Component({
  selector: 'fims-customer-detail-form',
  templateUrl: './detail.component.html'
})
export class CustomerDetailFormComponent extends FormComponent<CustomerDetailFormData> {

  @Input() set formData(formData: CustomerDetailFormData){
    this.form = this.formBuilder.group({
      identifier: [formData.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      firstName: [formData.firstName, Validators.required],
      middleName: [formData.middleName],
      lastName: [formData.lastName, Validators.required],
      dayOfBirth: [this.formatDate(formData.birthYear, formData.birthMonth, formData.birthDay), Validators.required],
      member: [formData.member],
    })
  };

  @Input() editMode: boolean;

  private formatDate(year: number, month: number, day: number): string{
    return `${year}-${this.addZero(month)}-${this.addZero(day)}`;
  }

  private addZero(value: number): string{
    return ('0' + value).slice(-2);
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): CustomerDetailFormData{
    const birthDate: string = this.form.get('dayOfBirth').value;

    const chunks: string[] = birthDate ? birthDate.split('-') : [];

    return {
      identifier: this.form.get('identifier').value,
      firstName: this.form.get('firstName').value,
      middleName: this.form.get('middleName').value,
      lastName: this.form.get('lastName').value,
      birthYear: chunks.length ? Number(chunks[0]) : undefined,
      birthMonth: chunks.length ? Number(chunks[1]) : undefined,
      birthDay: chunks.length ? Number(chunks[2]) : undefined,
      member: this.form.get('member').value
    }
  }

}
