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
import {Component, Input,Output,OnInit,EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from '../../../common/forms/form.component';
import {FormBuilder, Validators,FormGroup} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';
import {Frequency } from '../../../services/group/domain/cycle.model';
import {Observable} from 'rxjs/Observable';
import { Meeting } from '../../../services/group/domain/meeting.model';
import {Group} from '../../../services/group/domain/group.model'


@Component({
    selector:'fims-group-meeting-date',
    templateUrl:'meeting-date.component.html'
})

export class MeetingDateComponent implements OnInit{

    private _group: Group;
  form:FormGroup
 

  Frequency=[
      {value:'DAILY', viewValue:'Daily'},
      {value:'WEEKLY', viewValue:'Weekly'},
      {value:'FORTNIGHTLY', viewValue:'Fortnightly'},
      {value:'MONTHLY', viewValue:'Monthly'},
]

Repeat =[
    {value:'1', viewValue:'1'},
    {value:'2', viewValue:'2'},
    {value:'3', viewValue:'3'},
    {value:'4', viewValue:'4'},
    {value:'5', viewValue:'5'},
]

  constructor(private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute) {}

    ngOnInit(){
        this.form= this.formBuilder.group({
           startDate:['',Validators.required],
           day:['',Validators.required] 

        })
    }

    onSave(){
        
        console.log('frequency.value, repeat.value still to be implemented');
    }

    onCancel() {
        this.navigateAway();
      }
    
      navigateAway(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
      
}