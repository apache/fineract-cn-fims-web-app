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
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Group} from '../../../services/group/domain/group.model';
import * as fromGroups from '../../store';
import {GroupsStore} from '../../store/index';
import {UPDATE} from '../../store/group.actions';
import {Catalog} from '../../../services/catalog/domain/catalog.model';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditGroupFormComponent {

  group$: Observable<Group>;

  constructor(private router: Router, private route: ActivatedRoute, private store: GroupsStore) {
    this.group$ = store.select(fromGroups.getSelectedGroup);
  }

  onSave(group: Group) {
    this.store.dispatch({ type: UPDATE, payload: {
      group,
      activatedRoute: this.route
    } });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
