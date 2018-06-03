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
import {MeetingDateComponent} from '../meetingDate/meeting-date.component'
import { ActivatedRouteStub } from '../../../common/testing/router-stubs';


@Component({
  templateUrl: './edit-meeting.form.component.html'
})
export class EditMeetingDateComponent implements OnInit {


  meetingDate$: Observable<MeetingDateComponent>;

  constructor(private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){}



  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}