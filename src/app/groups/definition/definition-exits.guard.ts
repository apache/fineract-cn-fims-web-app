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
import * as fromGroups from '../store';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {GroupsStore} from '../store/index';
import {GroupService} from '../../services/group/group.service';
import {ExistsGuardService} from '../../common/guards/exists-guard';
import {LoadAction} from '../store/definition/definition.actions';

@Injectable()
export class GroupDefinitionExistsGuard implements CanActivate {

  constructor(private store: GroupsStore,
              private groupService: GroupService,
              private existsGuardService: ExistsGuardService) {
  }

  hasGroupDefinitionInStore(id: string): Observable<boolean> {
    const timestamp$: Observable<number> = this.store.select(fromGroups.getGroupDefinitionLoadedAt)
      .map(loadedAt => loadedAt[id]);

    return this.existsGuardService.isWithinExpiry(timestamp$);
  }

  hasGroupDefinitionInApi(id: string): Observable<boolean> {
    const getGroupDefinition$: Observable<any> = this.groupService.getGroupDefinition(id)
      .map(groupDefinitionEntity => new LoadAction({
        resource: groupDefinitionEntity
      }))
      .do((action: LoadAction) => this.store.dispatch(action))
      .map(groupDefinition => !!groupDefinition);

    return this.existsGuardService.routeTo404OnError(getGroupDefinition$);
  }

  hasGroupDefinition(id: string): Observable<boolean> {
    return this.hasGroupDefinitionInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasGroupDefinitionInApi(id);
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasGroupDefinition(route.params['id']);
  }
}
