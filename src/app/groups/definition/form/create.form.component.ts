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
 
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GroupDefinition} from '../../../services/group/domain/group-definition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupsStore} from '../../store/index';
import {CREATE,RESET_FORM} from '../../store/definition/definition.actions';
import {Cycle} from '../../../services/group/domain/cycle.model'
import {CycleFormComponent} from './cycle-form.component';
import {Subscription} from 'rxjs/Subscription';
import * as fromGroups from '../../store';
import {Error} from '../../../services/domain/error.model';


@Component({
  templateUrl: './create.form.component.html'
})
  
export class CreateGroupDefinitionFormComponent implements OnInit, OnDestroy {

private formStateSubscription: Subscription;
@ViewChild('form') formComponent: CycleFormComponent;


  group: GroupDefinition = {
    identifier : '',
    description : '',
    minimalSize : 4,
    maximalSize : 20,
    cycle: {
        numberOfMeetings : 4,
        frequency : 'DAILY',
        adjustment : 'SKIP'
      },
    createdOn : '',
    createdBy: '',
    lastModifiedOn :'',
    lastModifiedBy: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: GroupsStore) {}

  ngOnInit() {
    this.formStateSubscription = this.store.select(fromGroups.getGroupFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.formComponent.showIdentifierValidationError());
  }



  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM });
  }

  onSave(groupDefinition: GroupDefinition) {
    this.store.dispatch({ type: CREATE, payload: {
      groupDefinition,
      activatedRoute: this.route
    } });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
*/