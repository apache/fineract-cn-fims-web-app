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

import {AbstractControl} from '@angular/forms';

export function setSelections(key: string, control: AbstractControl, selections: string[]): void{
  let keyControl: AbstractControl = control.get(key);
  keyControl.setValue(selections && selections.length > 0 ? selections[0] : undefined);
  keyControl.markAsDirty();
}

export function setSelection(key: string, control: AbstractControl, selection: string): void{
  let keyControl: AbstractControl = control.get(key);
  keyControl.setValue(selection);
  keyControl.markAsDirty();
}

