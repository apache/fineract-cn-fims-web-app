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

import {ComponentFixture} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

export function setValueByFormControlName(fixture: ComponentFixture<any>, formControlName: string, value: string): Observable<any> {
  const debugElement: DebugElement = fixture.debugElement.query(By.css(`input[formControlName="${formControlName}"]`));

  if(!debugElement) throw new Error(`Could not find debug element for form control name: ${formControlName}`);

  setValue(debugElement, value);

  fixture.detectChanges();
  return Observable.fromPromise(fixture.whenStable());
}

export function setValueByCssSelector(fixture: ComponentFixture<any>, selector: string, value: string): Observable<any> {
  const debugElement: DebugElement = fixture.debugElement.query(By.css(selector));

  if(!debugElement) throw new Error(`Could not find debug element with selector: ${selector}`);

  setValue(debugElement, value);

  fixture.detectChanges();
  return Observable.fromPromise(fixture.whenStable());
}

function setValue(debugElement: DebugElement, value: string): void {
  const inputElement: HTMLInputElement = debugElement.nativeElement;
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
}
