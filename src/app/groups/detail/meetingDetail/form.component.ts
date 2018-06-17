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
import {TableData, TableFetchRequest} from '../../../common/data-table/data-table.component';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';
import {SEARCH} from '../../../store/customer/customer.actions';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';


@Component({
    selector: 'fims-meeting-detail-component',
    templateUrl: './form.component.html'
})


export class MeetingDetailFormComponent implements OnInit{
    
form:FormGroup
customers: Observable<Customer[]>;
states1: Observable< Status[]>;

constructor(private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder, private store: GroupsStore) {
    ;
  }

/*states =[
    {value:this.states1[0], viewValue:'Expected'},
    {value:this.states1[1], viewValue:'Attended'},
    {value:this.states1[2], viewValue:'Missed'},
] */



    @Input('editMode') editMode: boolean;

    @Output('onSave') onSave = new EventEmitter<Meeting>();

    @Output('onCancel') onCancel = new EventEmitter<void>();

    @ViewChild('detailsStep') step: TdStepComponent;

    @Input('meeting') group:Meeting[];





    selectedStatus: string[] =[];

ngOnInit(){
    this.form= this.formBuilder.group({
       sequence:[Validators.required], 
       name:['',Validators.required],
       heldOn:['',Validators.required],
       duration:['',Validators.required],
       location:['',Validators.required],
       nextMeeting:['',Validators.required],

    })
    this.customers = this.store.select(fromRoot.getCustomerSearchResults)
      .map(customerPage => customerPage.customers);
}

    save(){
        
    }

    cancel() {
        this.onCancel.emit();
      }

      meetingData$: Observable<TableData>;
  //customers: Observable<Customer[]>;
  status: Observable< Status[]>;

  columns: any[] = [
    {name:'customer.givenName',label:'Attendees'},
    {name:'attendee.status',label:'Status'}
  ]
  
  @Input() preSelection: string;

  @Output() onSelectionChange = new EventEmitter<string[]>();

  search(searchTerm) {
    const fetchRequest: FetchRequest = {
      searchTerm
    };

    this.store.dispatch({ type: SEARCH, payload: fetchRequest });
  }

  select(selections: string[]): void {
    this.onSelectionChange.emit(selections);
  }
}


