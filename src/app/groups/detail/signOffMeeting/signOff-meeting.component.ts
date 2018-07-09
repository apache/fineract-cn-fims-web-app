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
import { Attendee,Status} from '../../../services/group/domain/attendee.model';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Observable} from 'rxjs/Observable';
import {Meeting} from '../../../services/group/domain/meeting.model'
import * as fromGroups from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {GroupsStore} from '../../store/index';
import {CREATE, RESET_FORM} from '../../store/group.actions';
import {Error} from '../../../services/domain/error.model';
import { TdStepComponent } from '@covalent/core';
//import {TableData, TableFetchRequest} from '../../../common/data-table/data-table.component';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';
import {StatusOptionList} from './domain/status-option-list.model';
import {CustomerService} from '../../../services/customer/customer.service';


@Component({
    templateUrl:'./signOff-meeting.component.html'
})

export class SignOffMeetingComponent implements OnInit{
      
form:FormGroup
customers: Observable<Customer>; 

statusOptions = StatusOptionList;

@ViewChild('detailsStep') step: TdStepComponent;

@ViewChild('detailsStep') detailsStep: TdStepComponent;


constructor(private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder, private store: GroupsStore,
  private customerService: CustomerService) {
    this.customers = customerService.getCustomer("identifier").share();
  }
   
ngOnInit(){
    this.form= this.formBuilder.group({
       sequence: ['', [Validators.required, FimsValidators.minValue(0)]],
       cycle : ['', [Validators.required, FimsValidators.minValue(0)]],
       duration:['',[Validators.required, FimsValidators.minValue(0)]],
       status: ['', [Validators.required]],

    })

      this.detailsStep.open();
}


    save(){
     
    }

    cancel() {
        
      }
}