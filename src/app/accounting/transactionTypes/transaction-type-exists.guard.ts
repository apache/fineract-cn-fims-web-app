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

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import * as fromAccounting from '../store/index';
import {AccountingStore} from '../store/index';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {Observable} from 'rxjs/Observable';
import {LoadAction} from '../store/ledger/transaction-type/transaction-type.actions';
import {of} from 'rxjs/observable/of';

@Injectable()
export class TransactionTypeExistsGuard implements CanActivate {

  constructor(private store: AccountingStore,
              private accountingService: AccountingService,
              private existsGuardService: ExistsGuardService) {
  }

  hasTransactionTypeInStore(code: string): Observable<boolean> {
    const timestamp$: Observable<number> = this.store.select(fromAccounting.getTransactionTypeLoadedAt)
      .map(loadedAt => loadedAt[code]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasTransactionTypeInApi(code: string): Observable<boolean> {
    const getTransactionType: Observable<any> = this.accountingService.findTransactionType(code)
      .map(transactionTypeEntity => new LoadAction({
        resource: transactionTypeEntity
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(transactionType => !!transactionType);

    return this.existsGuardService.routeTo404OnError(getTransactionType);
  }

  hasTransactionType(code: string): Observable<boolean> {
    return this.hasTransactionTypeInStore(code)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasTransactionTypeInApi(code);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasTransactionType(route.params['code']);
  }
}
