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
import {Component, Input} from '@angular/core';
import {FormComponent} from '../../../common/forms/form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';
import { Status, Weekday } from '../../../services/group/domain/group.model';

export interface GroupDetailFormData {
  identifier: string;
  name: string;
  externalId: string;
  createdBy: string;
  createdOn:string;
  //active:boolean
}

@Component({
  selector: 'fims-group-detail-form',
  templateUrl: './detail.component.html'
})
export class GroupDetailFormComponent extends FormComponent<GroupDetailFormData> {

  @Input() set formData(formData: GroupDetailFormData) {
    const createdOn = formData.createdOn;

    this.form = this.formBuilder.group({
      identifier: [formData.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      name: [formData.name, [Validators.required, Validators.maxLength(256)]],
      externalId: [formData.externalId, Validators.maxLength(256)],
      createdBy: [formData.createdBy, [Validators.required, Validators.maxLength(256)]],
      createdOn:[formData.createdOn, [Validators.required, Validators.maxLength(256)]],
     // active: [formData.active]
    });
  };

  @Input() editMode: boolean;

  private formatDate(year: number, month: number, day: number): string {
    return `${year}-${this.addZero(month)}-${this.addZero(day)}`;
  }

  private addZero(value: number): string {
    return ('0' + value).slice(-2);
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData():GroupDetailFormData{
    //const createdOn: string = this.form.get('createdOn').value;

    //const chunks: string[] = createdOn ? createdOn.split('-') : [];

    return {
      identifier: this.form.get('identifier').value,
      name: this.form.get('name').value,
      externalId: this.form.get('externalId').value,
      createdBy: this.form.get(' createdBy').value,
      createdOn:this.form.get('createdOn').value,
      //active: this.form.get('active').value
    };
  }

}
