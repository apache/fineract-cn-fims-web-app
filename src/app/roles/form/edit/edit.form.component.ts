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
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../services/identity/domain/role.model';
import * as fromRoles from '../../store';
import {Subscription} from 'rxjs';
import {UPDATE, SelectAction} from '../../store/role.actions';
import {RolesStore} from '../../store/index';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditRoleFormComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;
  private roleSubscription: Subscription;

  role: Role;

  constructor(private router: Router, private route: ActivatedRoute, private store: RolesStore){}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.roleSubscription = this.store.select(fromRoles.getSelectedRole).subscribe((role: Role) => {
      this.role = role;
    });
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.roleSubscription.unsubscribe();
  }

  onSave(role: Role): void {
    this.store.dispatch({ type: UPDATE, payload: {
      role,
      activatedRoute: this.route
    } });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
