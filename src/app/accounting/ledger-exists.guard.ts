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

import {Store} from '@ngrx/store';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromAccounting from './store';
import {Observable} from 'rxjs';
import {LoadAction} from './store/ledger/ledger.actions';
import {of} from 'rxjs/observable/of';
import {AccountingService} from '../../services/accounting/accounting.service';

@Injectable()
export class LedgerExistsGuard implements CanActivate {

  constructor(private store: Store<fromAccounting.State>,
              private accountingService: AccountingService,
              private router: Router) {}

  hasLedgerInStore(id: string): Observable<boolean> {
    return this.store.select(fromAccounting.getLedgerEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  hasLedgerInApi(id: string): Observable<boolean> {
    return this.accountingService.findLedger(id)
      .map(ledgerEntity => new LoadAction(ledgerEntity))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(ledger => !!ledger)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  hasLedger(id: string): Observable<boolean> {
    return this.hasLedgerInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasLedgerInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasLedger(route.params['id']);
  }
}
