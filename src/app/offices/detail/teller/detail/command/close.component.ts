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
import {FormBuilder, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {
  Action, Adjustment,
  TellerManagementCommand
} from '../../../../../../services/teller/domain/teller-management-command.model';
import {FormComponent} from '../../../../../../common/forms/form.component';
import {AccountingService} from '../../../../../../services/accounting/accounting.service';
import {FimsValidators} from '../../../../../../common/validator/validators';
import {OfficeService} from '../../../../../../services/office/office.service';
import {employeeExists} from '../../../../../../common/validator/employee-exists.validator';
import {Teller} from '../../../../../../services/teller/domain/teller.model';

interface AdjustmentOption {
  key: string | Adjustment,
  label: string;
}

@Component({
  selector: 'fims-teller-close-command',
  templateUrl: './close.component.html'
})
export class CloseOfficeTellerFormComponent extends FormComponent<TellerManagementCommand> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  @Output() onClose = new EventEmitter<TellerManagementCommand>();

  @Output() onCancel = new EventEmitter<void>();

  adjustmentOptions: AdjustmentOption[] = [
    { key: 'NONE', label: 'None' },
    { key: 'DEBIT', label: 'Debit' },
    { key: 'CREDIT', label: 'Credit' }
  ];

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      adjustment: ['NONE'],
      amount: [0, FimsValidators.minValue(0)],
    });

    this.step.open();
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get formData(): TellerManagementCommand {
    // Not needed
    return null;
  }

  close(): void {
    const command: TellerManagementCommand = {
      action: 'CLOSE',
      adjustment: this.form.get('adjustment').value,
      amount: this.form.get('amount').value,
    };

    this.onClose.emit(command);
  }

}
