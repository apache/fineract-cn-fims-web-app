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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TdStepComponent } from '@covalent/core';
import { Group ,Status} from '../../../services/group/domain/group.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';


@Component({
    selector: 'fims-group-close-component',
    templateUrl: './form.component.html'
})
export class CloseGroupFormComponent implements OnInit {

    form: FormGroup;

    private _group: Group;

    reasons=[
        {value:'No members', viewValue:'No Members'},
        {value:'No Funds', viewValue:'No funds'}
    ]

    constructor(private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder) { }

     @ViewChild('detailsStep') detailsStep: TdStepComponent;

    @Input('editMode') editMode: boolean;

    @Output('onSave') onSave = new EventEmitter<Group>();

    @Output('onCancel') onCancel = new EventEmitter<void>();

    @ViewChild('detailsStep') step: TdStepComponent;

    @Input('group') group:Group[];


    ngOnInit(): void {
        this.form = this.formBuilder.group({
          //identifier:[],
          closeDate: ['23/06/19',Validators],
          reason :[this.reasons,Validators]
        });
    
      }

    
     status: 'CLOSED'

      save():void{
        
        this._group.status= this.status;
        console.log();

       // this.onSave.emit(_group);

      }

      cancel() {
        this.onCancel.emit();
      }
}