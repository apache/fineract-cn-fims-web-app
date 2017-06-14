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

import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {Observable} from 'rxjs';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {LOGIN} from '../reducers/security/security.actions';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdCardModule,
  MdIconModule,
  MdInputModule,
  MdOptionModule,
  MdSelectModule,
  MdTooltipModule
} from '@angular/material';
import {CovalentLoadingModule} from '@covalent/core';
import {setValueByFormControlName} from '../../common/testing/input-fields';

describe('Test Login Component', () => {

  let fixture: ComponentFixture<LoginComponent>;

  let loginComponent: LoginComponent;

  let router: Router;

  beforeEach(async(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        MdIconModule,
        MdCardModule,
        MdInputModule,
        MdSelectModule,
        MdOptionModule,
        MdTooltipModule,
        NoopAnimationsModule,
        CovalentLoadingModule
      ],
      providers: [
        {provide: 'tenantId', useValue: 'tenantId'},
        {provide: Router, useValue: router},
        {provide: ActivatedRoute, useValue: {
          queryParams: Observable.of([])
        }},
        {
          provide: Store,
          useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty())
          }
        }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
  }));

  it('should disable/enable login button', () => {
    fixture.detectChanges();

    let button: DebugElement = fixture.debugElement.query(By.css('button'));

    expect(button.properties['disabled']).toBeTruthy('Button should be disabled');

    loginComponent.form.setValue({
      tenant: 'tenantId',
      username: 'test',
      password: 'test'
    });

    fixture.detectChanges();

    expect(button.properties['disabled']).toBeFalsy('Button should be enabled');
  });

  xit('should show error message', async(inject([Store], (store: Store<any>) => {
    store.select = jasmine.createSpy('select').and.returnValue(Observable.of({ error: {} }));

    fixture.detectChanges();

    loginComponent.form.setValue({
      tenant: 'tenantId',
      username: 'test',
      password: 'test'
    });

    fixture.detectChanges();

    let button: DebugElement = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      let error: DebugElement = fixture.debugElement.query(By.css('p'));
      expect(error).toBeDefined('Debug element should be defined');
      expect(error.nativeElement.textContent.length).toBeGreaterThan(0, 'Error message should not be empty');
    });

  })));

  it('should set the username', (done: DoneFn) => {
    fixture.detectChanges();
    setValueByFormControlName(fixture, 'username', 'test').subscribe(() => {
      expect(loginComponent.form.get('username').value).toBe('test');
      done();
    });
  });

  it('should set the password', (done: DoneFn) => {
    fixture.detectChanges();
    setValueByFormControlName(fixture, 'password', 'test').subscribe(() => {
      expect(loginComponent.form.get('password').value).toBe('test');
      done();
    });
  });

  it('should send the right user and password', async(inject([Store], (store: Store<any>) => {
    fixture.detectChanges();

    loginComponent.form.setValue({
      tenant: 'tenantId',
      username: 'test',
      password: 'test'
    });

    fixture.detectChanges();

    let button: DebugElement = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith({ type: LOGIN, payload: {
        username: 'test',
        password: 'test',
        tenant: 'tenantId'
      }})
    });

  })));

});
