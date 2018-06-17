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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild,forwardRef } from '@angular/core';
import { TdStepComponent } from '@covalent/core';
import { Group, Status } from '../../../services/group/domain/group.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { FimsValidators } from '../../../common/validator/validators';
import {FormComponent} from '../../../common/forms/form.component';

export interface CloseGroupFormData{
  reason:string,
  closeDay: {
    day?: number;
    month?: number;
    year?: number;
  };
}


@Component({
  selector: 'fims-group-close-component',
  templateUrl: './form.component.html',
})
export class CloseGroupFormComponent extends FormComponent<CloseGroupFormData> {
  //form: FormGroup;
  private _group: Group;

  reasons = [
    { value: 'No members', viewValue: 'No Members' },
    { value: 'No Funds', viewValue: 'No funds' }
  ]
 @ViewChild('detailsStep') detailsStep: TdStepComponent;

@Output('onSave') onSave = new EventEmitter<Group>();

@Output('onCancel') onCancel = new EventEmitter<void>();

@ViewChild('detailsStep') step: TdStepComponent;

@Input('group') group: Group[];

  @Input() set formData(formData: CloseGroupFormData) {
    const closeDay = formData.closeDay;

    this.form = this.formBuilder.group({
      closeDate: [closeDay ? this.formatDate(closeDay.year, closeDay.month, closeDay.day) : undefined,
        [Validators.required,FimsValidators.afterToday]],
      reason: [this.reasons, Validators]
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
    get formData() : CloseGroupFormData{
      const birthDate: string = this.form.get('closeDate').value;
  
      const chunks: string[] = birthDate ? birthDate.split('-') : [];
      return{
        reason: this.form.get('reason').value,
        closeDay: {
          year: chunks.length ? Number(chunks[0]) : undefined,
          month: chunks.length ? Number(chunks[1]) : undefined,
          day: chunks.length ? Number(chunks[2]) : undefined,
        }
      }
      
    }

    save(): void {
      //this._group.status = 'CLOSED'//this.status;
      console.log();
      // this.onSave.emit(_group);
      }
      
      cancel() {
      this.onCancel.emit();
      }
  }

  
  