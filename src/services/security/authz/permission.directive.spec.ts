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

import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {PermissionDirective} from './permission.directive';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FimsPermission} from './fims-permission.model';

describe('Test permission directive', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store, useClass: class {
            select = function(){}
          }
        }
      ],
      declarations: [PermissionDirective, TestComponentWithObject]
    })
  });

  describe('Test permission directive with object parameter', () => {
    it('should add item to dom', () => {
      const store = TestBed.get(Store);

      spyOn(store, 'select').and.returnValue(Observable.of<FimsPermission[]>([
        { id: 'office_offices', accessLevel: 'READ'}
      ]));

      const fixture = TestBed.createComponent(TestComponentWithObject);
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('button'));
      expect(element).not.toBeNull('Button should be existent within the dom');
    });

    it('should remove item from dom', () => {
      const store = TestBed.get(Store);
      spyOn(store, 'select').and.returnValue(Observable.of([]));

      const fixture = TestBed.createComponent(TestComponentWithObject);
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('button'));
      expect(element).toBeNull('Button should be not existent within the dom');
    })
  });

});

@Component({
  template: `
    <button *hasPermission="{ id: 'office_offices', accessLevel: 'READ' }">randomTestValue</button>
  `
})
class TestComponentWithObject{}
