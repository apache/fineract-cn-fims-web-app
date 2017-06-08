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

import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RoleFormComponent} from './form.component';
import {PermittableGroup} from '../../../services/anubis/permittable-group.model';
import {Observable} from 'rxjs';
import {IdentityService} from '../../../services/identity/identity.service';
import {MaterialModule, MdCheckboxModule, MdIconModule, MdInputModule} from '@angular/material';
import {Role} from '../../../services/identity/domain/role.model';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {IdInputComponent} from '../../../common/id-input/id-input.component';
import {PermittableGroupIdMapper} from '../../../services/security/authz/permittable-group-id-mapper';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormPermissionService} from '../helper/form-permission.service';
import {CovalentStepsModule} from '@covalent/core';
import {PermissionListItemComponent} from '../components/permission-list-item.component';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}

describe('Test roles form', () => {

  let fixture: ComponentFixture<RoleFormComponent>;
  let component: RoleFormComponent;

  let officePermittable: PermittableGroup = {
    identifier: 'office__v1__offices',
    permittables: [
      {path: '/offices', method: 'POST'},
      {path: '/offices', method: 'PUT'}
    ]
  };

  let identityService = {
    getPermittableGroups(): Observable<PermittableGroup[]> {
      let permittableGroups: PermittableGroup[] = [];
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
        MdInputModule,
        MdIconModule,
        MdCheckboxModule,
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
        let expected: Role = {
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

    //Wait for async service call
    fixture.whenStable().then(() => {
      let formPermission = component.formPermissions[0];
      formPermission.change = false;

      component.onSave.subscribe((role: Role) => {
        let expected: Role = {
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
  }))
});
