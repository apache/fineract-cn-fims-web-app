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
import {FimsValidators} from '../../../common/validator/validators';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Observable} from 'rxjs/Observable';
import {FormControl, Validators,FormGroup} from '@angular/forms';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';
import {SEARCH} from '../../../store/customer/customer.actions';

@Component({
    selector:'fims-group-manage-member',
    templateUrl:'./manage-member.component.html'
})

export class ManageMemberComponent implements OnInit{

    myControl: FormControl = new FormControl();
    
    customers: Observable<Customer[]>;

    @Input() preSelection: string;

  @Output() onSelectionChange = new EventEmitter<string[]>();

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.customers = this.store.select(fromRoot.getCustomerSearchResults)
      .map(customerPage => customerPage.customers);
  }

  search(searchTerm) {
    const fetchRequest: FetchRequest = {
      searchTerm
    };

    this.store.dispatch({ type: SEARCH, payload: fetchRequest });
  }

  select(selections: string[]): void {
    this.onSelectionChange.emit(selections);
  }

  addMember():void{
      console.log("add member to group, still to be implemented");
  }

  delete(){} // to delete selected members

  onBack(){} // navigate back
}