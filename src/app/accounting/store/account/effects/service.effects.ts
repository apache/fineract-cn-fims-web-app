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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as accountActions from '../account.actions';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AccountApiEffects {

  @Effect()
  createAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.CREATE)
    .map((action: accountActions.CreateAccountAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.createAccount(payload.account)
        .map(() => new accountActions.CreateAccountSuccessAction({
          resource: payload.account,
          activatedRoute: payload.activatedRoute
        }))
        .catch(error => of(new accountActions.CreateAccountFailAction(error)))
    );

  @Effect()
  updateAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.UPDATE)
    .map((action: accountActions.UpdateAccountAction) => action.payload)
    .mergeMap(payload =>
        this.accountingService.modifyAccount(payload.account)
          .map(() => new accountActions.UpdateAccountSuccessAction({
            resource: payload.account,
            activatedRoute: payload.activatedRoute
          }))
          .catch(error => of(new accountActions.UpdateAccountFailAction(error)))
    );

  @Effect()
  deleteAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.DELETE)
    .map((action: accountActions.DeleteAccountAction) => action.payload)
    .mergeMap(payload =>
      this.accountingService.deleteAccount(payload.account)
        .map(() => new accountActions.DeleteAccountSuccessAction({
          resource: payload.account,
          activatedRoute: payload.activatedRoute
        }))
        .catch(error => of(new accountActions.DeleteAccountFailAction(error)))
    );

  constructor(private actions$: Actions, private accountingService: AccountingService) { }

}
