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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../../../common/validator/validators';

export interface UploadPageFormData {
  pageNumber: number;
  file: File;
}

@Component({
  selector: 'fims-upload-page-form',
  templateUrl: './upload-page.form.component.html'
})
export class UploadPageFormComponent implements OnInit {

  form: FormGroup;

  @Output() onSave = new EventEmitter<UploadPageFormData>();

  @Output() onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      pageNumber: ['', [Validators.required, FimsValidators.minValue(0)]],
      file: ['', [Validators.required, FimsValidators.maxFileSize(512)]]
    });
  }

  save(): void {
    this.onSave.emit(this.form.getRawValue());
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
