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
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../services/identity/domain/role.model';
import {PermittableGroup} from '../../services/anubis/permittable-group.model';
import {IdentityService} from '../../services/identity/identity.service';
import {FormPermission} from '../model/form-permission.model';
import {FimsValidators} from '../../common/validator/validators';
import {FormPermissionService} from '../helper/form-permission.service';
import {FormPermissionGroup} from '../model/form-permission-group.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'fims-role-form-component',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class RoleFormComponent implements OnInit, OnDestroy {

  private permittableGroupSubscription: Subscription;

  private _role: Role;

  permissionGroups: FormPermissionGroup[] = [];

  formPermissions: FormPermission[] = [];

  detailForm: FormGroup;

  @Input() editMode: boolean;

  @Input('role') set role(role: Role) {
    this._role = role;
    this.prepareForm(role);
  }

  @Output('onSave') onSave = new EventEmitter<Role>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private identityService: IdentityService,
              private formPermissionService: FormPermissionService) {}

  ngOnInit(): void {
    this.permittableGroupSubscription = this.identityService.getPermittableGroups()
      .subscribe((groups: PermittableGroup[]) => {
        this.permissionGroups = this.formPermissionService.mapToFormPermissions(groups, this._role.permissions);

        this.permissionGroups.forEach(group => {
          this.formPermissions.push(...group.formPermissions);
        });
      });
  }

  ngOnDestroy(): void {
    this.permittableGroupSubscription.unsubscribe();
  }

  private prepareForm(role: Role): void {
    this.detailForm = this.formBuilder.group({
      identifier: [role.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]]
    });
  }

  save(): void {
    const identifier = this.detailForm.get('identifier').value;
    this.onSave.emit(this.formPermissionService.mapToRole(identifier, this.formPermissions));
  }

  cancel(): void {
    this.onCancel.emit();
  }

  set allRead(checked: boolean) {
    for (const formPermission of this.formPermissions) {
      formPermission.read = checked;
    }
  }

  set allChange(checked: boolean) {
    for (const formPermission of this.formPermissions) {
      formPermission.change = checked;
    }
  }

  set allRemove(checked: boolean) {
    for (const formPermission of this.formPermissions) {
      formPermission.remove = checked;
    }
  }

  get allRead(): boolean {
    const found: FormPermission = this.formPermissions.find(formPermission => !formPermission.read);
    return !found;
  }

  get allChange(): boolean {
    const found: FormPermission = this.formPermissions.find(formPermission => !formPermission.change);
    return !found;
  }

  get allRemove(): boolean {
    const found: FormPermission = this.formPermissions.find(formPermission => !formPermission.remove);
    return !found;
  }

}
