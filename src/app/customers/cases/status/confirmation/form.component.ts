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
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkflowAction} from '../../../../services/portfolio/domain/individuallending/workflow-action.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FimsCase} from '../../../../services/portfolio/domain/fims-case.model';
import {Fee} from '../services/domain/fee.model';

export interface ExecuteCommandEvent {
  productId: string;
  caseId: string;
  action: WorkflowAction;
  note: string;
  paymentSize: number;
  createdOn: string;
}

@Component({
  selector: 'fims-case-command-confirmation-form',
  templateUrl: './form.component.html'
})
export class CaseCommandConfirmationFormComponent implements OnInit {

  numberFormat = '2.2-2';

  formGroup: FormGroup;

  @Input() fees: Fee[];

  @Input() action: WorkflowAction;

  @Input() fimsCase: FimsCase;

  @Output() onExecuteCommand = new EventEmitter<ExecuteCommandEvent>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      note: ['']
    });
  }

  get totalAmount(): number {
    if (!this.fees) {
      return 0;
    }
    return this.fees.reduce((acc, val) => acc + val.amount, 0);
  }

  executeCommand(): void {
    this.onExecuteCommand.emit({
      caseId: this.fimsCase.identifier,
      productId: this.fimsCase.productIdentifier,
      note: this.formGroup.get('note').value,
      action: this.action,
      paymentSize: this.action === 'DISBURSE' ? this.fimsCase.parameters.maximumBalance : 0,
      createdOn: new Date().toISOString()
    });
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
