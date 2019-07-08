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
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../../services/group/domain/group.model';
import { GroupFormComponent } from '../form.component';
import * as fromGroups from '../../store';
import { Error } from '../../../services/domain/error.model';
import { Subscription } from 'rxjs/Subscription';
import { GroupsStore } from '../../store/index';
import { CREATE, RESET_FORM } from '../../store/group.actions';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateGroupFormComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  @ViewChild('form') formComponent: GroupFormComponent;

  group: Group = {

    identifier: ' ',
    groupDefinitionIdentifier: '',
    name: '',
    leaders: [],
    members: [],
    office: '',
    assignedEmployee: '',
    weekday: 1,
    status: 'PENDING',
    address: {
      street: '',
      city: '',
      countryCode: '',
      country: '',
    },
    createdOn: ''

  };

  constructor(private router: Router, private route: ActivatedRoute, private store: GroupsStore) {
    ;
  }

  ngOnInit() {
    this.formStateSubscription = this.store.select(fromGroups.getGroupFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.formComponent.showIdentifierValidationError());
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM });
  }

  onSave(group: Group) {
    this.store.dispatch({
      type: CREATE, payload: {
        group,
        activatedRoute: this.route
      }
    });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
