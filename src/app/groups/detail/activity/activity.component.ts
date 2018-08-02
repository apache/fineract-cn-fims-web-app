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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupCommand} from '../../../services/group/domain/group-command.model';
import {GroupsStore} from '../../store/index';
import {LOAD_ALL} from '../../store/commands/commands.actions';
import * as fromGroups from '../../store';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './activity.component.html'
})
export class GroupActivityComponent implements OnInit, OnDestroy {

  private commandsSubscription: Subscription;

  private groupSubscription: Subscription;

  commands: GroupCommand[];

  constructor(private store: GroupsStore) {}

  ngOnInit(): void {
    this.groupSubscription = this.store.select(fromGroups.getSelectedGroup)
      .subscribe(group => this.store.dispatch({ type: LOAD_ALL, payload: group.identifier }));

    this.commandsSubscription = this.store.select(fromGroups.getAllGroupCommands)
      .subscribe(commands => this.commands = commands);
  }

  ngOnDestroy(): void {
    this.commandsSubscription.unsubscribe();
    this.groupSubscription.unsubscribe();
  }
}
