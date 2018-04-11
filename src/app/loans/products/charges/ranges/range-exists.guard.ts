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
import * as fromProducts from '../../store';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {ExistsGuardService} from '../../../../common/guards/exists-guard';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {PortfolioStore} from '../../store/index';
import {RangeActions} from '../../store/ranges/range.actions';
import {FimsRange} from '../../../../services/portfolio/domain/range-model';

@Injectable()
export class ProductChargeRangeExistsGuard implements CanActivate {

  constructor(private store: PortfolioStore,
              private portfolioService: PortfolioService,
              private existsGuardService: ExistsGuardService) {}

  hasRangeInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromProducts.getProductChargeRangesLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasRangeInApi(productId: string, rangeId: string): Observable<boolean> {
    const getRange = this.portfolioService.getRange(productId, rangeId)
      .do((resource: FimsRange) => this.store.dispatch(RangeActions.loadAction({
        resource
      })))
      .map(resource => !!resource);

    return this.existsGuardService.routeTo404OnError(getRange);
  }

  hasRange(productId: string, rangeId: string): Observable<boolean> {
    return this.hasRangeInStore(rangeId)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasRangeInApi(productId, rangeId);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasRange(route.parent.params['productId'], route.params['rangeId']);
  }
}
