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
import {By} from '@angular/platform-browser';
import {ComponentFixture} from '@angular/core/testing';

export function clickOption(fixture: ComponentFixture<any>, optionIndex: number): void {
  const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

  trigger.click();

  fixture.detectChanges();

  const options = fixture.debugElement.queryAll(By.css('mat-option'));

  options[optionIndex].nativeElement.click();

  fixture.detectChanges();
}
