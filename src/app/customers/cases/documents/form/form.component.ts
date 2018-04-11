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
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {CustomerDocument} from '../../../../services/customer/domain/customer-document.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';

@Component({
  selector: 'fims-case-document-form',
  templateUrl: './form.component.html'
})
export class CaseDocumentFormComponent implements OnChanges {

  form: FormGroup;

  @Input() document: CustomerDocument;

  @Input() editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<CustomerDocument>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      description: ['', Validators.maxLength(4096)]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.document) {
      this.form.reset({
        description: this.document.description
      })
    }
  }

  save(): void {
    const document: CustomerDocument = Object.assign({}, this.document, {
      description: this.form.get('description').value
    });

    this.onSave.emit(document);
  }

  cancel(): void {
    this.onCancel.emit();
  }

}
