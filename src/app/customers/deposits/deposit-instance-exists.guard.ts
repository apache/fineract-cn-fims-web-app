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
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromDeposits from './store';
import {Observable, of} from 'rxjs';
import {DepositsStore} from './store/index';
import {DepositAccountService} from '../../services/depositAccount/deposit-account.service';
import {ExistsGuardService} from '../../common/guards/exists-guard';
import {LoadAction} from './store/deposit.actions';
import {switchMap, map, tap} from 'rxjs/operators';

@Injectable()
export class DepositInstanceExistsGuard implements CanActivate {

  constructor(private store: DepositsStore,
              private depositService: DepositAccountService,
              private existsGuardService: ExistsGuardService) {}

  hasProductInstanceInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromDeposits.getDepositsLoadedAt).pipe(
      map(loadedAt => loadedAt[id]));

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasProductInstanceInApi(id: string): Observable<boolean> {
    const getProductInstance$ = this.depositService.findProductInstance(id).pipe(
      map(productInstance => new LoadAction({
        resource: productInstance
      })),
      tap((action: LoadAction) => this.store.dispatch(action)),
      map(productInstance => !!productInstance));

    return this.existsGuardService.routeTo404OnError(getProductInstance$);
  }

  hasProductInstance(id: string): Observable<boolean> {
    return this.hasProductInstanceInStore(id).pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasProductInstanceInApi(id);
      }));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasProductInstance(route.params['id']);
  }
}
