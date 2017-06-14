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
import * as fromProducts from '../store';
import {Observable} from 'rxjs';
import {LoadAction} from '../store/charges/charge.actions';
import {of} from 'rxjs/observable/of';
import {PortfolioStore} from '../store/index';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {ExistsGuardService} from '../../../../common/guards/exists-guard';

@Injectable()
export class ProductChargeExistsGuard implements CanActivate {

  constructor(private store: PortfolioStore,
              private portfolioService: PortfolioService,
              private existsGuardService: ExistsGuardService) {}

  hasChargeInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromProducts.getProductChargesLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasChargeInApi(productId: string, chargeId: string): Observable<boolean> {
    const getChargeDefinition = this.portfolioService.getChargeDefinition(productId, chargeId)
      .map(chargeEntity => new LoadAction({
        resource: chargeEntity
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(charge => !!charge);

    return this.existsGuardService.routeTo404OnError(getChargeDefinition);
  }

  hasCharge(productId: string, chargeId: string): Observable<boolean> {
    return this.hasChargeInStore(chargeId)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasChargeInApi(productId, chargeId);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasCharge(route.params['productId'], route.params['chargeId']);
  }
}
