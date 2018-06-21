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
import { GroupCommand} from '../../../services/group/domain/group-command.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { FimsValidators } from '../../../common/validator/validators';
import {FormComponent} from '../../../common/forms/form.component';


@Component({
  selector: 'fims-group-close-component',
  templateUrl: './form.component.html',
})
export class CloseGroupFormComponent implements OnInit {
  form: FormGroup;
  
 @ViewChild('detailsStep') detailsStep: TdStepComponent;

 @Input('groupCommand') groupCommand: GroupCommand;

@Output('onSave') onSave = new EventEmitter<GroupCommand>();

@Output('onCancel') onCancel = new EventEmitter<void>();

@ViewChild('detailsStep') step: TdStepComponent;

//@Input('group') group: Group[];
 
    constructor(private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        closeDate:['',Validators.required],
        description: ['', Validators.maxLength(2048)],
      })
    }

    ngOnInit(): void {
      this.detailsStep.open();
    }
  
    save() {
        
      const groupCommand : GroupCommand = {
        action:'CLOSE',
       note: this.form.get('description').value,
      };
      this.onSave.emit(groupCommand);
    }
      
      cancel() {
      this.onCancel.emit();
      }
  }

  
  