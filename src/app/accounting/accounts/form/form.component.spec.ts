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
import {Component, DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AccountFormComponent} from './form.component';
import {By} from '@angular/platform-browser';
import {Account} from '../../../services/accounting/domain/account.model';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FimsSharedModule} from '../../../common/common.module';
import {MatCheckboxModule, MatInputModule, MatRadioModule} from '@angular/material';
import {CovalentStepsModule} from '@covalent/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('Test account form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatCheckboxModule,
        MatRadioModule,
        MatInputModule,
        CovalentStepsModule,
        FimsSharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [
        AccountFormComponent,
        TestComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture  = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should trigger save event', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button[mat-raised-button]'));

    button.nativeElement.click();

    expect(testComponent.savedAccount).toEqual(testComponent.account);
  });

  it('should trigger cancel event', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button[mat-button]'));

    button.nativeElement.click();

    expect(testComponent.canceled).toBeTruthy();
  });

});

@Component({
  template: `
    <fims-account-form-component
      (onSave)="onSave($event)"
      (onCancel)="onCancel($event)"
      [account]="account"
      [editMode]="true">
    </fims-account-form-component>`
})
class TestComponent {

  account: Account = {
    identifier: 'test',
    type: 'ASSET',
    name: 'test',
    ledger: 'test',
    balance: 10
  };

  savedAccount: Account;

  canceled: boolean;

  onSave(account: Account): void {
    this.savedAccount = account;
  }

  onCancel(): void {
    this.canceled = true;
  }

}
