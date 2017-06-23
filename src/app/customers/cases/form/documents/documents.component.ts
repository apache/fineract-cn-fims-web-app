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

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Document} from '../../../../../services/portfolio/domain/individuallending/document.model';
import {FormComponent} from '../../../../../common/forms/form.component';

@Component({
  selector: 'fims-case-documents-form',
  templateUrl: './documents.component.html'
})
export class CaseDocumentsFormComponent extends FormComponent<Document[]> implements OnInit {

  files: any;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      documents: this.initDocuments([])
    });
  }

  get formData(): Document[] {
    return this.formDocuments.value;
  }

  private initDocuments(documents: Document[]): FormArray {
    const formControls: FormGroup[] = [];
    documents.forEach(document => formControls.push(this.initDocument(document)));
    return this.formBuilder.array(formControls);
  }

  private initDocument(document?: Document): FormGroup {
    return this.formBuilder.group({
      description: [document ? document.description : '', [Validators.required]],
      file: []
    })
  }

  get formDocuments(): FormArray {
    return this.form.get('documents') as FormArray;
  }

  addDocument(): void {
    this.formDocuments.push(this.initDocument());
  }

  removeDocument(index: number): void {
    this.formDocuments.removeAt(index);
  }

  get documentControls(): AbstractControl[] {
    return this.formDocuments.controls;
  }

  selectEvent(file: File): void {};

}
