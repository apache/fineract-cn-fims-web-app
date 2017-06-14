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
import {LoadAction} from '../store/tasks/task.actions';
import {of} from 'rxjs/observable/of';
import {PortfolioStore} from '../store/index';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {ExistsGuardService} from '../../../../common/guards/exists-guard';

@Injectable()
export class ProductTaskExistsGuard implements CanActivate {

  constructor(private store: PortfolioStore,
              private portfolioService: PortfolioService,
              private existsGuardService: ExistsGuardService) {}

  hasTaskInStore(id: string): Observable<boolean> {
    const timestamp$ = this.store.select(fromProducts.getProductTasksLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasTaskInApi(productId: string, taskId: string): Observable<boolean> {
    const getTaskDefintion$ = this.portfolioService.getTaskDefinition(productId, taskId)
      .map(taskEntity => new LoadAction({
        resource: taskEntity
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(task => !!task);

    return this.existsGuardService.routeTo404OnError(getTaskDefintion$);
  }

  hasTask(productId: string, taskId: string): Observable<boolean> {
    return this.hasTaskInStore(taskId)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }

        return this.hasTaskInApi(productId, taskId);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasTask(route.params['productId'], route.params['taskId']);
  }
}
