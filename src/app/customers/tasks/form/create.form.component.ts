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
import {TaskDefinition} from '../../../services/customer/domain/task-definition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomersStore} from '../../store/index';
import {CREATE} from '../../store/tasks/task.actions';

@Component({
  templateUrl: './create.form.component.html'
})
export class TaskCreateFormComponent {

  task: TaskDefinition = {
    identifier: '',
    name: '',
    description: '',
    type: 'ID_CARD',
    commands: [
      'ACTIVATE'
    ],
    mandatory: false,
    predefined: false
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: CustomersStore) {}

  onSave(task: TaskDefinition): void {
    this.store.dispatch({ type: CREATE, payload: {
      task,
      activatedRoute: this.route
    }});
  }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
