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
import {TranslateService} from '@ngx-translate/core';
import * as fromRoot from './reducers';
import {Store} from '@ngrx/store';
import {LoginSuccessAction} from './reducers/security/security.actions';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'fims-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;

  constructor(private translate: TranslateService, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  relogin(): void {
    this.store.select(fromRoot.getAuthenticationState)
      .filter(state => !!state.authentication)
      .take(1)
      .map(state => ({
        username: state.username,
        tenant: state.tenant,
        authentication: state.authentication
      }))
      .map(payload => new LoginSuccessAction(payload))
      .subscribe((action: LoginSuccessAction) => this.store.dispatch(action))
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
