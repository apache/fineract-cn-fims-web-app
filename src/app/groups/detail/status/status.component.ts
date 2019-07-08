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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommandAction, GroupCommand } from '../../../services/group/domain/group-command.model';
import { GroupsStore } from '../../store/index';
import { EXECUTE_COMMAND } from '../../store/groupTasks/group-task.actions';
import { Group } from '../../../services/group/domain/group.model';
import * as fromGroups from '../../store';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store';
import { Observable } from 'rxjs/Observable';


interface StatusCommand {
  action: CommandAction;
  note?: string;
  createdBy?: '';
  createdOn?: '';
}

@Component({
  templateUrl: './status.component.html'
})
export class GroupStatusComponent implements OnInit {

  private groupIdentifier: string;
  private groupSubscription: Subscription;
  group: Group;
  username: Observable<string>;
  name: Subscription;
  name1: string;

  statusCommands: StatusCommand[] = [
    { action: 'ACTIVATE' },
    { action: 'CLOSE' },
    { action: 'REOPEN' }
  ];

  // getting the presence time
  private d = new Date();
  private n = this.d.toISOString();

  constructor(private route: ActivatedRoute, private store: GroupsStore, private store1: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.groupSubscription = this.store.select(fromGroups.getSelectedGroup)
      .subscribe(group => this.group = group);

    this.username = this.store1.select(fromRoot.getUsername)
    this.name = this.username.subscribe(res => this.name1 = res);

  }

  executeCommand(statusCommand: StatusCommand): void {
    const command: GroupCommand = {
      action: statusCommand.action,
      note: statusCommand.note,
      createdBy: this.name1,
      createdOn: this.n
    };
    this.store.dispatch({
      type: EXECUTE_COMMAND, payload: {
        groupId: this.group.identifier,
        command,
        activatedRoute: this.route
      }
    });
  }
}
