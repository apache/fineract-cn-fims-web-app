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

import {PermittableGroupIdMapper} from '../../../../services/security/authz/permittable-group-id-mapper';

export class FormPermission{
  private _groupIdentifier: string;
  private _read: boolean = false;
  private _change: boolean = false;
  private _remove: boolean = false;
  private _groupIdMapper: PermittableGroupIdMapper;

  constructor(groupIdentifier: string, groupIdMapper: PermittableGroupIdMapper) {
    this._groupIdentifier = groupIdentifier;
    this._groupIdMapper = groupIdMapper;
  }

  get groupIdentifier(): string {
    return this._groupIdentifier;
  }

  get label(): string{
    var descriptor = this._groupIdMapper.map(this._groupIdentifier);
    return descriptor.label;
  }

  get readOnly(): boolean{
    var descriptor = this._groupIdMapper.map(this._groupIdentifier);
    return descriptor.readOnly;
  }

  get read(): boolean {
    return this._read;
  }

  set read(value: boolean) {
    this._read = value;
  }

  get change(): boolean {
    return this._change;
  }

  set change(value: boolean) {
    this._change = value;
  }

  get remove(): boolean {
    return this._remove;
  }

  set remove(value: boolean) {
    this._remove = value;
  }
}
