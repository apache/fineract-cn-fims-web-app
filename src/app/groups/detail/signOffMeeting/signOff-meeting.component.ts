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
import * as fromGroups from '../../store';
import {Subscription} from 'rxjs/Subscription';
import { TdStepComponent } from '@covalent/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';
import {StatusOptionList} from './domain/status-option-list.model';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {SEARCH} from '../../../store/customer/customer.actions';



@Component({
    templateUrl:'./signOff-meeting.component.html'
})

export class SignOffMeetingComponent implements OnInit{
      
form:FormGroup
customers: Observable<Customer[]>;
customers1: Customer[];
name:Subscription;

statusOptions = StatusOptionList;

@ViewChild('detailsStep') step: TdStepComponent;

@ViewChild('detailsStep') detailsStep: TdStepComponent;


constructor(private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder, 
  private store: Store<fromRoot.State>) {
   // this.customers = customerService.getCustomer("identifier").share();
  }
   
ngOnInit(){
    this.form= this.formBuilder.group({
       sequence: ['', [Validators.required, FimsValidators.minValue(0)]],
       cycle : ['', [Validators.required, FimsValidators.minValue(0)]],
       duration:['',[Validators.required, FimsValidators.minValue(0)]],
       status: ['', [Validators.required]],

    })

      this.detailsStep.open();

      this.customers = this.store.select(fromRoot.getCustomerSearchResults)
      .map(customerPage => customerPage.customers)
     
      this.name= this.customers.subscribe(res => this.customers1=res)
      console.log(this.customers1);

      
}
search(searchTerm) {
  const fetchRequest: FetchRequest = {
    searchTerm
  };

  this.store.dispatch({ type: SEARCH, payload: fetchRequest });
}


    save(){
     
    }

    cancel() {
        
      }
}