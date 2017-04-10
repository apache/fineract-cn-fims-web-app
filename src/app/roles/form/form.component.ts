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
import {FimsPermissionDescriptor} from '../../../services/security/authz/fims-permission-descriptor';

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

  @Input('role') set role(role: Role) {
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

    for(let permittableGroup of groups) {
      let foundPermission: Permission = this.findPermission(permittableGroup.identifier, permissions);

      let descriptor: FimsPermissionDescriptor = this.idMapper.map(permittableGroup.identifier);

      if(!descriptor) continue;

      let formPermission = new FormPermission(permittableGroup.identifier);

      formPermission.label = descriptor.label;
      formPermission.readOnly = descriptor.readOnly;

      if(foundPermission) {
        formPermission.read = this.hasOperation(foundPermission.allowedOperations, 'READ');
        formPermission.change = this.hasOperation(foundPermission.allowedOperations, 'CHANGE');
        formPermission.remove = this.hasOperation(foundPermission.allowedOperations, 'DELETE');
      }
      result.push(formPermission)
    }
    return result;
  }

  private hasOperation(allowedOperations: AllowedOperation[], operation: AllowedOperation): boolean {
    return allowedOperations.indexOf(operation) > -1;
  }

  private findPermission(identifier: string, permissions: Permission[]): Permission {
    return permissions.find((permission: Permission) => permission.permittableEndpointGroupIdentifier === identifier);
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
