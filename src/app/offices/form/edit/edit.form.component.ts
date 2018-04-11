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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Office} from '../../../services/office/domain/office.model';
import {getSelectedOffice, OfficesStore} from '../../store';
import {UPDATE} from '../../store/office.actions';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditOfficeFormComponent implements OnInit, OnDestroy {

  private officeSubscription: Subscription;

  office: Office;

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore) {}

  ngOnInit() {
    this.officeSubscription = this.store.select(getSelectedOffice).subscribe((office: Office) => this.office = office);
  }

  ngOnDestroy(): void {
    this.officeSubscription.unsubscribe();
  }

  onSave(office: Office) {
    office.parentIdentifier = this.office.parentIdentifier;
    this.store.dispatch({ type: UPDATE, payload: {
      office,
      activatedRoute: this.route
    }});
  };

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route } );
  }
}
