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
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {PortfolioService} from '../../../services/portfolio/portfolio.service';
import {ExistsGuardService} from '../../../common/guards/exists-guard';
import * as fromPortfolio from '../store/index';
import {PortfolioStore} from '../store/index';
import {Observable} from 'rxjs/Observable';
import {LoadAction} from '../store/lossProvision/loss-provision.actions';
import {of} from 'rxjs/observable/of';

@Injectable()
export class LoanLossProvisionExistsGuard implements CanActivate {

  constructor(private store: PortfolioStore,
              private portfolioService: PortfolioService,
              private existsGuardService: ExistsGuardService) {
  }

  hasConfigurationInStore(): Observable<boolean> {
    const timestamp$: Observable<number> = this.store.select(fromPortfolio.getProductLossProvisionConfigurationLoadedAt);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasConfigurationInApi(id: string): Observable<boolean> {
    return this.portfolioService.getLossProvisionConfiguration(id)
      .map(configuration => new LoadAction(configuration))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(catalog => !!catalog);
  }

  hasConfiguration(id: string): Observable<boolean> {
    return this.hasConfigurationInStore()
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasConfigurationInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasConfiguration(route.parent.params['productId']);
  }
}
