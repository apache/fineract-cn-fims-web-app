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
import { Component, Input } from '@angular/core';
import { FormComponent } from '../../../common/forms/form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { FimsValidators } from '../../../common/validator/validators';
import { Status, Weekday } from '../../../services/group/domain/group.model';
import { WeekdayOptionList } from '../domain/weekday-options.model';

export interface GroupDetailFormData {
  identifier: string;
  name: string;
  groupDefinitionIdentifier: string;
  weekday: number;

}

@Component({
  selector: 'fims-group-detail-form',
  templateUrl: './detail.component.html'
})
export class GroupDetailFormComponent extends FormComponent<GroupDetailFormData> {

  weekdayOptions = WeekdayOptionList;

  @Input() set formData(formData: GroupDetailFormData) {

    this.form = this.formBuilder.group({
      identifier: [formData.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      name: [formData.name, [Validators.required, Validators.maxLength(256)]],
      groupDefinitionIdentifier: [formData.groupDefinitionIdentifier, Validators.maxLength(256)],
      weekday: [formData.weekday, [Validators.required, Validators.maxLength(7)]],
    });
  };

  @Input() editMode: boolean;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formData(): GroupDetailFormData {

    return {
      identifier: this.form.get('identifier').value,
      name: this.form.get('name').value,
      groupDefinitionIdentifier: this.form.get('groupDefinitionIdentifier').value,
      weekday: this.form.get('weekday').value
    };
  }

}
