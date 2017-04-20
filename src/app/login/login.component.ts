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
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ITdLoadingConfig, LoadingType, TdLoadingService} from '@covalent/core';
import {ActivatedRoute, Params} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fromRoot from '../reducers';
import {Store} from '@ngrx/store';
import {LOGIN} from '../reducers/security/security.actions';
import {Subscription} from 'rxjs';
import {MdSelectChange} from '@angular/material';

@Component({
  selector: 'fims-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  private loadingSubscription: Subscription;

  private errorSubscription: Subscription;

  currentLanguage: string;

  languageOptions: any[] = [
    { id: 'en', label: 'Welcome to fims'},
    { id: 'es', label: 'Bienvenido a fims'}
  ];

  form: FormGroup;

  error: string;

  constructor(private _loadingService: TdLoadingService, private translate: TranslateService, private formBuilder: FormBuilder, private store: Store<fromRoot.State>) {}

  ngOnInit(){
    this.currentLanguage = this.translate.currentLang || this.translate.getDefaultLang();

    let options: ITdLoadingConfig = {
      name: 'login',
      type: LoadingType.Circular,
    };
    this._loadingService.create(options);

    this.form = this.formBuilder.group({
      tenant: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.errorSubscription = this.store.select(fromRoot.getAuthenticationError)
      .filter(error => !!error)
      .subscribe(error => this.error = 'Sorry, that login did not work.');

    this.loadingSubscription = this.store.select(fromRoot.getAuthenticationLoading).subscribe(loading => {
      if(loading){
        this._loadingService.register('login');
      }else{
        this._loadingService.resolve('login');
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  login(): void {
    const tenant = this.form.get('tenant').value;
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;

    this.store.dispatch({ type: LOGIN, payload: {
      username,
      password,
      tenant
    }});
  }

  selectLanguage(mdSelectChange: MdSelectChange): void{
    this.translate.use(mdSelectChange.value);
  }
}
