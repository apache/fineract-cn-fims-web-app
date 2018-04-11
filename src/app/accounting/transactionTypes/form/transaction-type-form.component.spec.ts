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
import {FimsSharedModule} from '../../../common/common.module';
import {CovalentStepsModule} from '@covalent/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TransactionTypeFormComponent} from './transaction-type-form.component';
import {TransactionType} from '../../../services/accounting/domain/transaction-type.model';
import {MatInputModule} from '@angular/material';

describe('Test transaction type form', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatInputModule,
        CovalentStepsModule,
        FimsSharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [
        TransactionTypeFormComponent,
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

    expect(testComponent.savedType).toEqual(testComponent.type);
  });

  it('should trigger cancel event', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button[mat-button]'));

    button.nativeElement.click();

    expect(testComponent.canceled).toBeTruthy();
  });

});

@Component({
  template: `
    <fims-transaction-type-form (onSave)="onSave($event)" (onCancel)="onCancel($event)" [transactionType]="type" [editMode]="true">
    </fims-transaction-type-form>`
})
class TestComponent {

  type: TransactionType = {
    code: 'test',
    name: 'test',
    description: 'test'
  };

  savedType: TransactionType;

  canceled: boolean;

  onSave(type: TransactionType): void {
    this.savedType = type;
  }

  onCancel(): void {
    this.canceled = true;
  }

}
