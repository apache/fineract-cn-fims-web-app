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

import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromAccounting from '../store';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {LoadAction} from '../store/account/account.actions';
import {AccountingStore} from '../store/index';

@Injectable()
export class AccountExistsGuard implements CanActivate {

  constructor(private store: AccountingStore,
              private accountingService: AccountingService,
              private router: Router) {}

  hasAccountInStore(id: string): Observable<boolean> {
    return this.store.select(fromAccounting.getAccountEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasAccountInApi(id: string): Observable<boolean> {
    return this.accountingService.findAccount(id)
      .map(accountEntity => new LoadAction(accountEntity))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(employee => !!employee)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  hasAccount(id: string): Observable<boolean> {
    return this.hasAccountInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasAccountInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasAccount(route.params['id']);
  }
}
