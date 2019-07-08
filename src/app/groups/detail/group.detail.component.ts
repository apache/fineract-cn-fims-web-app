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
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../services/group/domain/group.model';
import * as fromGroups from '../store';
import { Subscription } from 'rxjs/Subscription';
import { GroupsStore } from '../store/index';
import { GroupService } from '../../services/group/group.service';

@Component({
  templateUrl: './group.detail.component.html',
  styleUrls: ['./group.detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnDestroy {

  private groupSubscription: Subscription;
  private actionsSubscription: Subscription;

  group: Group;
  isGroupActive: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private store: GroupsStore,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupSubscription = this.store.select(fromGroups.getSelectedGroup)
      .filter(group => !!group)
      .do(group => this.group = group)
      .do(group => this.isGroupActive = group.status === 'ACTIVE')
      .flatMap(group => this.groupService.getGroup(group.identifier))
      .subscribe(group => this.group = group);

  }
  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
  }

  searchGroup(term): void {
    if (term) {
      this.router.navigate(['../../../'], { queryParams: { term: term }, relativeTo: this.route });
    }
  }

  active(): void {
    this.router.navigate(['status'], { relativeTo: this.route });
  }
}
