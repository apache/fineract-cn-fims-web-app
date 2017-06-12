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

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {TellerManagementCommand} from '../../../../../../services/teller/domain/teller-management-command.model';
import {FormComponent} from '../../../../../../common/forms/form.component';
import {OfficeService} from '../../../../../../services/office/office.service';
import {employeeExists} from '../../../../../../common/validator/employee-exists.validator';

@Component({
  selector: 'fims-teller-open-command',
  templateUrl: './open.component.html'
})
export class OpenOfficeTellerFormComponent extends FormComponent<TellerManagementCommand> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  @Output() onOpen = new EventEmitter<TellerManagementCommand>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private officeService: OfficeService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      assignedEmployeeIdentifier: ['', [Validators.required], employeeExists(this.officeService)]
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

  open(): void {
    const command: TellerManagementCommand = {
      action: 'OPEN',
      assignedEmployeeIdentifier: this.form.get('assignedEmployeeIdentifier').value,
      adjustment: 'NONE'
    };

    this.onOpen.emit(command);
  }

}
