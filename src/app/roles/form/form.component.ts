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

import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Role} from '../../../services/identity/domain/role.model';
import {PermittableGroup} from '../../../services/anubis/permittable-group.model';
import {IdentityService} from '../../../services/identity/identity.service';
import {Permission, AllowedOperation} from '../../../services/identity/domain/permission.model';
import {FormPermission} from './model/form-permission.model';
import {FimsValidators} from '../../../components/validator/validators';
import {PermittableGroupIdMapper} from '../../../services/security/authz/permittable-group-id-mapper';

@Component({
  selector: 'fims-role-form-component',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class RoleFormComponent implements OnInit{

  private _role: Role;

  formPermissions: FormPermission[] = [];

  detailForm: FormGroup;

  @Input() editMode: boolean;

  @Input('role') set role(role: Role){
    this._role = role;
    this.prepareForm(role);
  }

  @Output('onSave') onSave = new EventEmitter<Role>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private identityService: IdentityService, private idMapper: PermittableGroupIdMapper) {}

  ngOnInit(): void {
    this.identityService.getPermittableGroups()
      .subscribe((groups: PermittableGroup[]) => {
        this.formPermissions = this.buildFormPermissions(groups, this._role.permissions);
      });
  }

  private buildFormPermissions(groups: PermittableGroup[], permissions: Permission[]): FormPermission[] {
    let result: FormPermission[] = [];

    for(let permittableGroup of groups){
      let foundPermissions: Permission[] = this.findPermission(permittableGroup.identifier, permissions);
      let formPermission = new FormPermission(permittableGroup.identifier, this.idMapper);

      if(foundPermissions.length){
        let permission: Permission = foundPermissions[0];
        formPermission.read = permission.allowedOperations.indexOf('READ') > -1;
        formPermission.change = permission.allowedOperations.indexOf('CHANGE') > -1;
        formPermission.remove = permission.allowedOperations.indexOf('DELETE') > -1;
      }
      result.push(formPermission)
    }
    return result;
  }

  private findPermission(identifier: string, permissions: Permission[]): Permission[] {
    return permissions.filter((permission) => permission.permittableEndpointGroupIdentifier === identifier);
  }

  private prepareForm(role: Role): void {
    this.detailForm = this.formBuilder.group({
      identifier: [role.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]]
    });
  }

  save(): void {
    let identifier = this.detailForm.get('identifier').value;
    this.onSave.emit(this.mapRole(identifier, this.formPermissions));
  }

  cancel(): void {
    this.onCancel.emit();
  }

  private mapRole(identifier: string, formPermissions: FormPermission[]): Role{
    let permissions: Permission[] = [];

    for(let formPermission of formPermissions){
      let allowedOperations: AllowedOperation[] = [];

      if(formPermission.read){
        allowedOperations.push('READ')
      }

      if(formPermission.change){
        allowedOperations.push('CHANGE')
      }

      if(formPermission.remove){
        allowedOperations.push('DELETE')
      }

      permissions.push({
        permittableEndpointGroupIdentifier: formPermission.groupIdentifier,
        allowedOperations: allowedOperations
      });
    }

    return {
      identifier: identifier,
      permissions: permissions
    };
  }
}
