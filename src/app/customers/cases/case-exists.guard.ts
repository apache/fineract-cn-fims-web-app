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

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromCases from './store';
import {Observable} from 'rxjs';
import {of} from 'rxjs/observable/of';
import {CasesStore} from './store/index';
import {PortfolioService} from '../../../services/portfolio/portfolio.service';
import {LoadAction} from './store/case.actions';
import {mapToFimsCase} from './store/model/fims-case.mapper';
import {ExistsGuardService} from '../../../common/guards/exists-guard';

@Injectable()
export class CaseExistsGuard implements CanActivate {

  constructor(private store: CasesStore,
              private portfolioService: PortfolioService,
              private existsGuardService: ExistsGuardService) {}

  hasCaseInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromCases.getCasesLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasCaseInApi(productId: string, caseId: string): Observable<boolean> {
    const getCase$ = this.portfolioService.getCase(productId, caseId)
      .map(caseEntity => new LoadAction({
        resource: mapToFimsCase(caseEntity)
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(caseEntity => !!caseEntity);

    return this.existsGuardService.routeTo404OnError(getCase$);
  }

  hasCase(productId: string, caseId: string): Observable<boolean> {
    return this.hasCaseInStore(caseId)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasCaseInApi(productId, caseId);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasCase(route.params['productId'], route.params['caseId']);
  }
}
