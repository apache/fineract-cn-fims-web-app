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
import {Component, Input,Output,OnInit,EventEmitter,ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from '../../../common/forms/form.component';
import {FormBuilder, Validators,FormGroup} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';
import { Attendee} from '../../../services/group/domain/attendee.model';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Observable, Subscription} from 'rxjs';
import * as fromGroups from '../../store';
import { TdStepComponent } from '@covalent/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';
import {StatusOptionList} from './domain/status-option-list.model';
import {SignOffMeeting} from '../../../services/group/domain/signoff-meeting.model'
import {UPDATE} from '../../store/meeting/meeting.actions';
import {Group} from '../../../services/group/domain/group.model';
import {GroupsStore} from '../../store/index';


@Component({
    templateUrl:'./signOff-meeting.component.html'
})

export class SignOffMeetingComponent implements OnInit{
      
form:FormGroup
customers: Observable<Customer[]>;
customers1: Customer[];
name:Subscription;
groupSubscription: Subscription;
group: Group;
members: any[];


attendee : Attendee[] =[];
len :number;
i:any;


statusOptions = StatusOptionList;

@ViewChild('detailsStep') step: TdStepComponent;

@ViewChild('detailsStep') detailsStep: TdStepComponent;

constructor(private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder, 
  private store: Store<fromRoot.State>, private store1: GroupsStore) {
  
  }
   
ngOnInit(){
    this.form= this.formBuilder.group({
       sequence: ['', [Validators.required, FimsValidators.minValue(0)]],
       cycle : ['', [Validators.required, FimsValidators.minValue(0)]],
       duration:['',[Validators.required, FimsValidators.minValue(0)]],
       status: ['', [Validators.required]],
       member:['']

    })

    this.groupSubscription = this.store1.select(fromGroups.getSelectedGroup)
   .subscribe(group => this.group = group);
      
    this.detailsStep.open();
    console.log(this.group.members)
    this.members= this.group.members;
    this.len = this.members.length


  }




    save(){
    
   for ( this.i in this.members){
    let attend : Attendee = {
      customerIdentifier:this.members[this.i],
      status : this.form.get('status').value,
    }
   console.log(attend);
   this.attendee.push(attend);
}
   console.log("attendde",this.attendee)
    

     const signoff : SignOffMeeting = {
        sequence:this.form.get('sequence').value,
        cycle: this.form.get('cycle').value,
        duration:this.form.get('duration').value,
        attendees:this.attendee
      };

      this.store1.dispatch({ type: UPDATE, payload: {
        groupId: this.group.identifier,
        signoff,
      activatedRoute: this.route
    } });
    }

    cancel() {
      this.navigateAway();
    }
  
    navigateAway(): void {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    
}
