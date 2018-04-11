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
import {Component, DebugElement, ViewChild} from '@angular/core';
import {JournalEntryFormComponent} from './form.component';
import {JournalEntry} from '../../../services/accounting/domain/journal-entry.model';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {FimsSharedModule} from '../../../common/common.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentStepsModule} from '@covalent/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {MatAutocompleteModule, MatCardModule, MatInputModule, MatOptionModule} from '@angular/material';
import {TransactionTypeSelectComponent} from './transaction-type-select/transaction-type-select.component';

describe('Test JournalEntryFormComponent', () => {

  let fixture: ComponentFixture<TestComponent>;

  let testComponent: TestComponent;

  let baseDate: Date;

  function mockValidJournalEntry(date: Date): JournalEntry {
    const journalEntry: JournalEntry = {
      transactionIdentifier: 'testId',
      transactionDate: date.toISOString(),
      transactionType: 'transactionType',
      note: 'testNote',
      message: 'testMessage',
      debtors: [
        { accountNumber: '1234', amount: '11' }
      ],
      creditors: [
        { accountNumber: '5678', amount: '11' }
      ],
      clerk: 'testClerk'
    };

    return journalEntry;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        TransactionTypeSelectComponent,
        JournalEntryFormComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FimsSharedModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        CovalentStepsModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: AccountingService, useClass: class {
          findTransactionType = jasmine.createSpy('findTransactionType').and.returnValue(Observable.of(null));
          fetchTransactionTypes = jasmine.createSpy('fetchTransactionTypes').and.returnValue(Observable.of([
            { code: 'transactionType', name: 'transactionType' }
          ]));
          findAccount = jasmine.createSpy('findAccount').and.returnValue(Observable.of(null));
          fetchAccounts = jasmine.createSpy('fetchAccounts').and.returnValue(Observable.of([
            { identifier: '1234', name: '1234' },
            { identifier: '5678', name: '1234' }
          ]));
        }}
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
  });

  beforeEach(() => {
    jasmine.clock().install();
    baseDate = new Date(2017, 1, 1);
    baseDate.setUTCHours(0, 0, 0, 1);
    jasmine.clock().mockDate(baseDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  function clickSaveButton(): void {
    const button: DebugElement = fixture.debugElement.query(By.css('.mat-raised-button.mat-primary'));

    expect(button.properties['disabled']).toBeFalsy('Button should be enabled');

    button.nativeElement.click();
  }

  it('should save correct values', () => {
    const journalEntry: JournalEntry = mockValidJournalEntry(baseDate);

    testComponent.journalEntry = journalEntry;

    fixture.detectChanges();

    clickSaveButton();

    expect(testComponent.savedJournalEntry).toEqual(journalEntry);
  });

  it('should disable button when form is invalid', () => {
    const journalEntry: JournalEntry = mockValidJournalEntry(baseDate);

    journalEntry.transactionType = '';

    testComponent.journalEntry = journalEntry;

    fixture.detectChanges();

    const button: DebugElement = fixture.debugElement.query(By.css('.mat-raised-button.mat-primary'));

    expect(button.properties['disabled']).toBeTruthy('Button should be disabled');
  });

  it('should render accounts', () => {
    const journalEntry: JournalEntry = mockValidJournalEntry(baseDate);

    testComponent.journalEntry = journalEntry;

    fixture.detectChanges();

    // Choose placeholder as selector as I could not find any other attribute to select on
    const debugElement: DebugElement[] = fixture.debugElement.queryAll(By.css('input[placeholder="Account"]'));

    // 1 debtor, 1 creditor
    expect(debugElement.length).toEqual(2);
  });
});

@Component({
  template: `
    <fims-journal-entry-form #form (onSave)="onSave($event)" (onCancel)="onCancel()" [journalEntry]="journalEntry">
    </fims-journal-entry-form>`
})
class TestComponent {

  @ViewChild('form') formComponent: JournalEntryFormComponent;

  journalEntry: JournalEntry;

  savedJournalEntry: JournalEntry;

  user: 'test';

  onSave(journalEntry: JournalEntry): void {
    this.savedJournalEntry = journalEntry;
  }

}
