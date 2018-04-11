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
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../common/validator/validators';
import {Subscription} from 'rxjs/Subscription';
import {Store} from '@ngrx/store';
import * as fromRoot from '../store';
import {CHANGE_PASSWORD} from '../store/security/security.actions';

@Component({
  selector: 'fims-user-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit, OnDestroy {

  private usernameSubscription: Subscription;

  private passwordErrorSubscription: Subscription;

  private currentUser: string;

  passwordForm: FormGroup;

  error: string;

  forced: boolean;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.forced = queryParams['forced'] === 'true';
    });

    this.usernameSubscription = this.store.select(fromRoot.getUsername)
      .subscribe(username => this.currentUser = username);

    this.passwordErrorSubscription = this.store.select(fromRoot.getPasswordError)
      .filter(error => !!error)
      .subscribe(error => this.error = 'There was an error changing your password');

    this.passwordForm = this.createFormGroup();
  }

  ngOnDestroy(): void {
    this.usernameSubscription.unsubscribe();
    this.passwordErrorSubscription.unsubscribe();
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required]
    }, { validator: FimsValidators.matchValues('newPassword', 'confirmNewPassword')});
  }

  changePassword() {
    const newPassword: string = this.passwordForm.get('newPassword').value;

    this.store.dispatch({ type: CHANGE_PASSWORD, payload: {
      username: this.currentUser,
      password: newPassword
    }});
  }

}
