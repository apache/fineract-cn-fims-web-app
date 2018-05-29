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
import { Attendee,Status} from '../../../services/group/domain/attendee.model';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Observable} from 'rxjs/Observable';



@Component({
    selector:'fims-meeting-detail',
    templateUrl:'./meeting-detail.component.html'
})

export class MeetingDetailComponent implements OnInit{
  form:FormGroup

  customers: Observable<Customer[]>;
  states1: Observable< Status[]>;

  states =[
      {value:this.states1[0], viewValue:'Expected'},
      {value:this.states1[1], viewValue:'Attended'},
      {value:this.states1[2], viewValue:'Missed'},
  ]


  constructor(private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute) {}

    ngOnInit(){
        this.form= this.formBuilder.group({
           name:['',Validators.required],
           heldOn:['',Validators.required],
           duration:['',Validators.required],
           location:['',Validators.required],
           nextMeeting:['',Validators.required],

        })
    }
    onSave(){
        console.log('state.value, to be implemented');
    }

    onCancel() {
        this.navigateAway();
      }
    
      navigateAway(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
      }

}