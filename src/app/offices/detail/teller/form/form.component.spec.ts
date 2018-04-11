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
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FimsSharedModule} from '../../../../common/common.module';
import {OfficeTellerFormComponent} from './form.component';
import {Teller} from '../../../../services/teller/domain/teller.model';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {MatCheckboxModule, MatInputModule, MatRadioModule} from '@angular/material';

describe('Test teller form', () => {

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
        OfficeTellerFormComponent,
        TestComponent
      ],
      providers: [
        {
          provide: AccountingService, useClass: class {
          findAccount = jasmine.createSpy('findAccount').and.returnValue({});
          fetchAccounts = jasmine.createSpy('fetchAccounts').and.returnValue([]);
        }
        }
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

    expect(testComponent.savedTeller).toEqual(testComponent.teller);
  });

  it('should trigger cancel event', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button[mat-button]'));

    button.nativeElement.click();

    expect(testComponent.canceled).toBeTruthy();
  });

});

@Component({
  template: `
    <fims-teller-form-component (onSave)="onSave($event)" (onCancel)="onCancel($event)" [teller]="teller" [editMode]="true">
    </fims-teller-form-component>`
})
class TestComponent {

  teller: Teller = {
    code: 'code',
    password: 'password',
    cashdrawLimit: 10,
    tellerAccountIdentifier: 'tellerAccountIdentifier',
    vaultAccountIdentifier: 'vaultAccountIdentifier',
    chequesReceivableAccount: 'chequesReceivableAccount',
    cashOverShortAccount: 'cashOverShortAccount',
    denominationRequired: false,
    assignedEmployee: 'assignedEmployee',
    createdBy: 'createdBy',
    createdOn: 'createdOn',
    lastModifiedBy: 'lastModifiedBy',
    lastModifiedOn: 'lastModifiedOn',
    state: 'ACTIVE'
  };

  savedTeller: Teller;

  canceled: boolean;

  onSave(teller: Teller): void {
    this.savedTeller = teller;
  }

  onCancel(): void {
    this.canceled = true;
  }

}
