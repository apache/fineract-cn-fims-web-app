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
import {DisplayableField} from '../../../services/reporting/domain/displayable-field.model';
import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'fims-reporting-displayable-fields',
  templateUrl: './displayable-fields.component.html'
})
export class ReportingDisplayableFieldsComponent implements OnInit {

  private _displayableFields: DisplayableField[];

  optionalFormControl: FormControl;

  filteredOptionalFields: DisplayableField[];

  mandatoryFields: DisplayableField[];

  optionalFields: DisplayableField[];

  @Input() set displayableFields(displayableFields: DisplayableField[]) {
    if (!displayableFields) {
      return;
    }

    this._displayableFields = displayableFields;

    this.mandatoryFields = displayableFields.filter(field => field.mandatory);
    this.optionalFields = displayableFields.filter(field => !field.mandatory);
  };

  constructor() {}

  ngOnInit(): void {
    this.optionalFormControl = new FormControl([]);
  }

  filterOptionalFields(value: string): void {
    this.filteredOptionalFields = this.optionalFields.filter(field => {
      if (value) {
        return field.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    }).filter((filteredObj: any) => {
      return this.optionalFormControl.value ? this.optionalFormControl.value.indexOf(filteredObj) < 0 : true;
    });
  }

  get formData(): DisplayableField[] {
    const allDisplayableFields = [
      ...this.mandatoryFields,
      ...this.optionalFormControl.value
    ];

    // Reuse input displayable field to keep order
    return this.displayableFields.filter(field => this.hasDisplayableField(field.name, allDisplayableFields));
  }

  private hasDisplayableField(name: string, displayableField: DisplayableField[]): boolean {
    const found = displayableField.find(field => field.name === name);
    return !!found;
  }

  get displayableFields(): DisplayableField[] {
    return this._displayableFields;
  }

}
