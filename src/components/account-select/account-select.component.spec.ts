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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {AccountPage} from '../../services/accounting/domain/account-page.model';
import {AccountSelectComponent} from './account-select.component';
import {ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {HttpClient} from '../../services/http/http.service';
import {AccountingService} from '../../services/accounting/accounting.service';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('Test account selection', () => {

  let fixture: ComponentFixture<TestComponent>;

  let input: HTMLInputElement;

  let testComponent: TestComponent;

  let accountingServiceMock = {
    fetchAccounts(): Observable<AccountPage>{
      let accountPage: AccountPage = {
        totalElements: 0,
        totalPages: 0,
        accounts: [{
          identifier: 'test',
          name: 'test',
          ledger: ''
        }]
      };
      return Observable.of(accountPage)
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        AccountSelectComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        HttpClient,
        { provide: AccountingService, useValue: accountingServiceMock }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  /**
   * TODO rethink this test, currently its testing nothing
   */
  xit('should test if the control is valid', () => {
    fixture.detectChanges();

    testComponent.formControl.setValue('te');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(testComponent.formControl.valid).toBeTruthy();
    });

  });

  xit('should test if the control is invalid', () => {
    fixture.detectChanges();

    testComponent.formControl.setValue('ge');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(testComponent.formControl.invalid).toBeTruthy();
    });

  })

});

@Component({
  template: '<fims-account-select #accountSelect [formControl]="formControl"></fims-account-select>'
})
class TestComponent{

  @ViewChild('accountSelect') accountSelect: AccountSelectComponent;

  formControl = new FormControl('', Validators.required);

}

function typeInElement(value: string, element: HTMLInputElement, autoFocus = true) {
  element.focus();
  element.value = value;
  dispatchFakeEvent(element, 'input');
}

function dispatchFakeEvent(node: Node, type: string) {
  node.dispatchEvent(createFakeEvent(type));
}

function createFakeEvent(type: string) {
  let event  = document.createEvent('Event');
  event.initEvent(type, true, true);
  return event;
}
