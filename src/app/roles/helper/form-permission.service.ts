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
import {FormPermission} from '../model/form-permission.model';
import {AllowedOperation, Permission} from '../../services/identity/domain/permission.model';
import {PermittableGroup} from '../../services/anubis/permittable-group.model';
import {FimsPermissionDescriptor} from '../../services/security/authz/fims-permission-descriptor';
import {Injectable} from '@angular/core';
import {PermittableGroupIdMapper} from '../../services/security/authz/permittable-group-id-mapper';
import {Role} from '../../services/identity/domain/role.model';
import {FormPermissionGroup} from '../model/form-permission-group.model';

@Injectable()
export class FormPermissionService {

  constructor(private idMapper: PermittableGroupIdMapper) {}

  mapToFormPermissions(groups: PermittableGroup[], permissions: Permission[]): FormPermissionGroup[] {
    const formGroups: FormPermissionGroup[] = [];

    for (const permittableGroup of groups) {
      const groupId = this.groupId(permittableGroup);

      let foundGroup = formGroups.find(group => group.groupId === groupId);

      if (!foundGroup) {
        foundGroup = {
          groupId,
          formPermissions: []
        };
        formGroups.push(foundGroup);
      }

      const foundPermission: Permission = this.findPermission(permittableGroup.identifier, permissions);

      const descriptor: FimsPermissionDescriptor = this.idMapper.map(permittableGroup.identifier);

      if (!descriptor) {
        continue;
      }

      const formPermission = new FormPermission(permittableGroup.identifier);

      formPermission.label = descriptor.label;
      formPermission.readOnly = descriptor.readOnly;

      if (foundPermission) {
        formPermission.read = this.hasOperation(foundPermission.allowedOperations, 'READ');
        formPermission.change = this.hasOperation(foundPermission.allowedOperations, 'CHANGE');
        formPermission.remove = this.hasOperation(foundPermission.allowedOperations, 'DELETE');
      }
      foundGroup.formPermissions.push(formPermission);
    }

    this.sortGroups(formGroups);

    return formGroups;
  }

  private sortGroups(formGroups: FormPermissionGroup[]) {
    formGroups.sort((a: FormPermissionGroup, b: FormPermissionGroup) => a.groupId.localeCompare(b.groupId));
    formGroups.forEach(group => group.formPermissions.sort((a: FormPermission, b: FormPermission) => a.label.localeCompare(b.label)));
  }

  private groupId(group: PermittableGroup): string {
    const identifier = group.identifier;
    return identifier.substring(0, identifier.indexOf('_')).toUpperCase();
  }

  private hasOperation(allowedOperations: AllowedOperation[], operation: AllowedOperation): boolean {
    return allowedOperations.indexOf(operation) > -1;
  }

  private findPermission(identifier: string, permissions: Permission[]): Permission {
    return permissions.find((permission: Permission) => permission.permittableEndpointGroupIdentifier === identifier);
  }

  mapToRole(identifier: string, formPermissions: FormPermission[]): Role {
    const permissions: Permission[] = [];

    for (const formPermission of formPermissions) {
      const allowedOperations: AllowedOperation[] = [];

      if (formPermission.read) {
        allowedOperations.push('READ');
      }

      if (formPermission.change) {
        allowedOperations.push('CHANGE');
      }

      if (formPermission.remove) {
        allowedOperations.push('DELETE');
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

