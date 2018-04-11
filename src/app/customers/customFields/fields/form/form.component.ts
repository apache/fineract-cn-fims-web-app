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
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {Field} from '../../../../services/catalog/domain/field.model';
import {Option} from '../../../../services/catalog/domain/option.model';
import {FieldFormService} from '../../services/field-form.service';

@Component({
  selector: 'fims-catalog-custom-field-form',
  templateUrl: './form.component.html'
})
export class CatalogFieldFormComponent implements OnInit, OnChanges {

  form: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Input('field') field: Field;

  @Output('onSave') onSave = new EventEmitter<Field>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private fieldFormService: FieldFormService) {
    this.form = fieldFormService.buildForm();
  }

  ngOnInit(): void {
    this.detailsStep.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.field) {
      this.fieldFormService.resetForm(this.form, this.field);

      this.form.get('identifier').disable();
      this.form.get('dataType').disable();
      this.form.get('length').disable();
      this.form.get('precision').disable();
      this.form.get('minValue').disable();
      this.form.get('maxValue').disable();
    }
  }

  save(): void {
    const field: Field = Object.assign({}, this.field, {
      label: this.form.get('label').value,
      hint: this.form.get('hint').value,
      description: this.form.get('description').value,
      mandatory: this.form.get('mandatory').value,
      options: this.form.get('options').value
    });

    this.onSave.emit(field);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  addOption(option?: Option): void {
    this.fieldFormService.addOption(this.form, option);
  }

  removeOption(index: number): void {
    this.fieldFormService.removeOption(this.form, index);
  }

}
