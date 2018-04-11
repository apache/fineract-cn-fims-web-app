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
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoleFormComponent} from './form.component';
import {PermittableGroup} from '../../services/anubis/permittable-group.model';
import {Observable} from 'rxjs/Observable';
import {IdentityService} from '../../services/identity/identity.service';
import {Role} from '../../services/identity/domain/role.model';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {IdInputComponent} from '../../common/id-input/id-input.component';
import {PermittableGroupIdMapper} from '../../services/security/authz/permittable-group-id-mapper';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormPermissionService} from '../helper/form-permission.service';
import {PermissionListItemComponent} from '../components/permission-list-item.component';
import {MatCheckboxModule, MatIconModule, MatInputModule} from '@angular/material';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}

describe('Test roles form', () => {

  let fixture: ComponentFixture<RoleFormComponent>;
  let component: RoleFormComponent;

  const officePermittable: PermittableGroup = {
    identifier: 'office__v1__offices',
    permittables: [
      {path: '/offices', method: 'POST'},
      {path: '/offices', method: 'PUT'}
    ]
  };

  const identityService = {
    getPermittableGroups(): Observable<PermittableGroup[]> {
      const permittableGroups: PermittableGroup[] = [];
      permittableGroups.push(officePermittable);
      return Observable.of(permittableGroups);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RoleFormComponent,
        IdInputComponent,
        PermissionListItemComponent
      ],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: IdentityService, useValue: identityService},
        FormPermissionService,
        PermittableGroupIdMapper
      ]
    });

    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
  });

  it('should save same role with given permission groups', async(() => {
    component.role = {
      identifier: 'test',
      permissions: [{
        permittableEndpointGroupIdentifier: officePermittable.identifier,
        allowedOperations: ['READ', 'CHANGE']
      }]
    };

    fixture.detectChanges();

    // Wait for async service call
    fixture.whenStable().then(() => {
      component.onSave.subscribe((role: Role) => {
        const expected: Role = {
          identifier: 'test',
          permissions: [{
            permittableEndpointGroupIdentifier: officePermittable.identifier,
            allowedOperations: ['READ', 'CHANGE']
          }]
        };
        expect(JSON.stringify(role)).toBe(JSON.stringify(expected));
      });
      component.save();
    });
  }));

  it('should save changed role when changed', async(() => {
    component.role = {identifier: 'test', permissions: [
      {
        permittableEndpointGroupIdentifier: officePermittable.identifier,
        allowedOperations: ['READ', 'CHANGE', 'DELETE']
      }
    ]};

    fixture.detectChanges();

    // Wait for async service call
    fixture.whenStable().then(() => {
      const formPermission = component.formPermissions[0];
      formPermission.change = false;

      component.onSave.subscribe((role: Role) => {
        const expected: Role = {
          identifier: 'test',
          permissions: [{
            permittableEndpointGroupIdentifier: officePermittable.identifier,
            allowedOperations: ['READ']
          }]
        };
        expect(JSON.stringify(role)).toBe(JSON.stringify(expected));
      });
      component.save();
    });
  }));
});
