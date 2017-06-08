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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormComponent} from '../../../../common/forms/form.component';
import {TransactionType} from '../../../../services/accounting/domain/transaction-type.model';
import {TdStepComponent} from '@covalent/core';
import {FormBuilder, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../common/validator/validators';

@Component({
  selector: 'fims-transaction-type-form',
  templateUrl: './transaction-type-form.component.html'
})
export class TransactionTypeFormComponent extends FormComponent<TransactionType> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input() transactionType: TransactionType;

  @Input() editMode: boolean = false;

  @Output('onSave') onSave = new EventEmitter<TransactionType>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [this.transactionType.code, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe]],
      name: [this.transactionType.name, [Validators.required, Validators.maxLength(256)]],
      description: [this.transactionType.description, [Validators.maxLength(2048)]]
    });

    this.step.open();
  }

  showNumberValidationError(): void {
    this.setError('number', 'unique', true);
  }

  get formData(): TransactionType {
    // Not needed
    return;
  }

  cancel(): void {
    this.onCancel.emit();
  }

  save(): void {
    const transactionType: TransactionType = {
      code: this.form.get('code').value,
      name: this.form.get('name').value,
      description: this.form.get('description').value
    };

    this.onSave.emit(transactionType);
  }

}
