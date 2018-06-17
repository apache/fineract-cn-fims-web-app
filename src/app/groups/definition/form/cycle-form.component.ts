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
 
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormComponent} from '../../../common/forms/form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {Cycle} from '../../../services/group/domain/cycle.model';
import {FimsValidators} from '../../../common/validator/validators';
import {TdStepComponent} from '@covalent/core';

@Component({
  selector: 'fims-groupDefinition-cycle-form',
  templateUrl: './cycle-form.component.html'
})
export class CycleFormComponent extends FormComponent<Cycle> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input() Cycle: Cycle;

  @Input() editMode = false;

  @Output('onSave') onSave = new EventEmitter<Cycle>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(){}
  showIdentifierValidationError(): void {
    this.setError('identifier', 'unique', true);

  }
}
*/