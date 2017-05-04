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

export class FormPermission {

  private _groupIdentifier: string;
  private _read: boolean = false;
  private _change: boolean = false;
  private _remove: boolean = false;

  private _label: string = '';
  private _readOnly: boolean = true;

  constructor(groupIdentifier: string) {
    this._groupIdentifier = groupIdentifier;
  }

  get groupIdentifier(): string {
    return this._groupIdentifier;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get readOnly(): boolean {
    return this._readOnly;
  }

  set readOnly(value: boolean) {
    this._readOnly = value;
  }

  get read(): boolean {
    return this._read;
  }

  set read(value: boolean) {
    this._read = value;

    if(!value) {
      this.change = false;
      this.remove = false;
    }
  }

  get change(): boolean {
    return this._change;
  }

  set change(value: boolean) {
    this._change = value;

    if(!value) {
      this.remove = false;
    } else {
      this.read = true;
    }
  }

  get remove(): boolean {
    return this._remove;
  }

  set remove(value: boolean) {
    this._remove = value;

    if(value) {
      this.read = true;
      this.change = true;
    }
  }
}
