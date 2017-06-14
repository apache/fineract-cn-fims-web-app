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

import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {LoadAction} from './store/product.actions';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {DepositAccountStore} from './store/index';
import {DepositAccountService} from '../../services/depositAccount/deposit-account.service';
import {ExistsGuardService} from '../../common/guards/exists-guard';
import * as fromProducts from './store/index';

@Injectable()
export class ProductDefinitionExistsGuard implements CanActivate {

  constructor(private store: DepositAccountStore,
              private accountService: DepositAccountService,
              private existsGuardService: ExistsGuardService) {}

  hasProductInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromProducts.getProductsLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasProductInApi(id: string): Observable<boolean> {
    const getProduct = this.accountService.findProductDefinition(id)
      .map(productEntity => new LoadAction({
        resource: productEntity
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(product => !!product);

    return this.existsGuardService.routeTo404OnError(getProduct);
  }

  hasProduct(id: string): Observable<boolean> {
    return this.hasProductInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasProductInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasProduct(route.params['id']);
  }
}
