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
import {ITdLoadingConfig, LoadingType, TdLoadingService} from '@covalent/core';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fromRoot from '../store';
import {Store} from '@ngrx/store';
import {LOGIN} from '../store/security/security.actions';
import {Subscription} from 'rxjs/Subscription';
import {TRANSLATE_STORAGE_KEY} from '../common/i18n/translate';
import {Observable} from 'rxjs/Observable';
import {MatSelectChange} from '@angular/material';

@Component({
  selector: 'fims-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  private loadingSubscription: Subscription;

  currentLanguage: string;

  languageOptions: any[] = [
    {id: 'en', label: 'Welcome to fims'},
    {id: 'es', label: 'Bienvenido a fims'}
  ];

  form: FormGroup;

  error$: Observable<string>;

  constructor(private _loadingService: TdLoadingService, private translate: TranslateService, private formBuilder: FormBuilder,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.currentLanguage = this.translate.currentLang || this.translate.getDefaultLang();

    const options: ITdLoadingConfig = {
      name: 'login',
      type: LoadingType.Circular,
    };

    this._loadingService.create(options);

    this.form = this.formBuilder.group({
      tenant: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error$ = this.store.select(fromRoot.getAuthenticationError)
      .filter(error => !!error)
      .do(() => this.form.get('password').setValue(''))
      .map(error => 'Sorry, that login did not work.');

    this.loadingSubscription = this.store.select(fromRoot.getAuthenticationLoading).subscribe(loading => {
      if (loading) {
        this._loadingService.register('login');
      } else {
        this._loadingService.resolve('login');
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  login(): void {
    const tenant = this.form.get('tenant').value;
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;

    this.store.dispatch({
      type: LOGIN, payload: {
        username,
        password,
        tenant
      }
    });
  }

  selectLanguage(selectChange: MatSelectChange): void {
    sessionStorage.setItem(TRANSLATE_STORAGE_KEY, selectChange.value);
    location.reload();
  }
}
