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
**/
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { GroupDefinition } from '../../../services/group/domain/group-definition.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FimsValidators } from '../../../common/validator/validators';
import { TdStepComponent } from '@covalent/core';
import { FrequencyOptionList } from '../domain/frequency-option-list.model';
import { AdjustmentOptionList } from '../domain/adjustment-option-list.model';

@Component({
  selector: 'fims-group-definition-form-component',
  templateUrl: './form.component.html'
})
export class GroupDefinitionFormComponent implements OnInit, OnChanges {
  form: FormGroup;

  frequencyOptions = FrequencyOptionList;

  adjustmentOptions = AdjustmentOptionList;

  @Input('editMode') editMode: boolean;

  @Input('groupDefinition') groupDefinition: GroupDefinition;

  @Output('onSave') onSave = new EventEmitter<GroupDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  constructor(private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      minimal: ['', [Validators.required, FimsValidators.minValue(0)]],
      maximal: ['', [Validators.required, FimsValidators.minValue(0)]],
      description: ['', Validators.maxLength(2048)],
      number: ['', [Validators.required, FimsValidators.minValue(0)]],
      frequency: ['', [Validators.required]],
      adjustment: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.detailsStep.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupDefinition) {
      this.form.reset({
        identifier: this.groupDefinition.identifier,
        minimal: this.groupDefinition.minimalSize,
        maximal: this.groupDefinition.maximalSize,
        description: this.groupDefinition.description,
        number: this.groupDefinition.cycle.numberOfMeetings,
        frequency: this.groupDefinition.cycle.frequency,
        adjustment: this.groupDefinition.cycle.adjustment
      })
    }
  }

  save() {
    const groupDefinition: GroupDefinition = {
      identifier: this.form.get('identifier').value,
      description: this.form.get('description').value,
      minimalSize: this.form.get('minimal').value,
      maximalSize: this.form.get('maximal').value,
      cycle: {
        numberOfMeetings: this.form.get('number').value,
        frequency: this.form.get('frequency').value,
        adjustment: this.form.get('adjustment').value
      }
    };
    this.onSave.emit(groupDefinition);
  }

  cancel() {
    this.onCancel.emit();
  }

}
