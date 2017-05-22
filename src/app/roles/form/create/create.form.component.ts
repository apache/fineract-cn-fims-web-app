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
import {Component, ViewChild, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Role} from '../../../../services/identity/domain/role.model';
import * as fromRoles from '../../store';
import {Subscription} from 'rxjs';
import {Error} from '../../../../services/domain/error.model';
import {RolesStore} from '../../store/index';
import {CREATE, RESET_FORM} from '../../store/role.actions';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateRoleFormComponent implements OnInit, OnDestroy{

  private formStateSubscription: Subscription;

  role: Role = { identifier: '', permissions: []};

  @ViewChild('form') formComponent;

  constructor(private router: Router, private route: ActivatedRoute, private store: RolesStore) {}

  ngOnInit(): void {
    this.formStateSubscription = this.store.select(fromRoles.getRoleFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => {
        let detailForm = this.formComponent.detailForm;
        let errors = detailForm.get('identifier').errors || {};
        errors['unique'] = true;
        detailForm.get('identifier').setErrors(errors);
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(role: Role): void {
    this.store.dispatch({ type: CREATE, payload: {
      role,
      activatedRoute: this.route
    } })
  }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
