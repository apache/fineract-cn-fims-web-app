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

import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DepositsStore} from './store/index';
import * as fromDesposits from './store/index';
import {DepositAccountService} from '../../../services/depositAccount/deposit-account.service';
import {ExistsGuardService} from '../../../components/guards/exists-guard';
import {LoadAction} from './store/deposit.actions';
import {of} from 'rxjs/observable/of';

@Injectable()
export class DepositExistsGuard implements CanActivate {

  constructor(private store: DepositsStore,
              private depositService: DepositAccountService,
              private existsGuardService: ExistsGuardService) {}

  hasProductInstanceInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromDesposits.getDepositsLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasProductInstanceInApi(productId: string): Observable<boolean> {
    const getProductInstance$ = this.depositService.findProductInstance(productId)
      .map(productInstance => new LoadAction({
        resource: productInstance
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(productInstance => !!productInstance);

    return this.existsGuardService.routeTo404OnError(getProductInstance$);
  }

  hasProductInstance(productId: string): Observable<boolean> {
    return this.hasProductInstanceInStore(productId)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasProductInstanceInApi(productId);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasProductInstance(route.params['productId']);
  }
}
