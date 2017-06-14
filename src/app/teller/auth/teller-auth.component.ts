/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {TellerStore} from '../store/index';
import * as fromRoot from '../../reducers/index';
import {UNLOCK_DRAWER} from '../store/teller.actions';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fromTeller from '../store/index';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './teller-auth.component.html'
})
export class TellerAuthComponent implements OnInit, OnDestroy {

  private userIdSubscription: Subscription;

  private userId: string;

  form: FormGroup;

  error$: Observable<boolean>;

  constructor(private store: TellerStore, private formBuilder: FormBuilder) {
    this.userIdSubscription = this.store.select(fromRoot.getUsername)
      .subscribe(username => this.userId = username);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tellerCode: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error$ = this.store.select(fromTeller.getAuthenticationError)
      .map(error => !!error);
  }

  ngOnDestroy(): void {
    this.userIdSubscription.unsubscribe();
  }

  auth(): void {
    const tellerCode = this.form.get('tellerCode').value;
    const password = this.form.get('password').value;

    this.store.dispatch({
      type: UNLOCK_DRAWER,
      payload: {
        employeeId: this.userId,
        tellerCode,
        password
      }
    })
  }

}
