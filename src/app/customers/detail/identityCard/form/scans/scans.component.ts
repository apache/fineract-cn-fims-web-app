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
import {IdentificationCardScan} from '../../../../../../services/customer/domain/identification-card-scan.model';
import {FormComponent} from '../../../../../../common/forms/form.component';

@Component({
  selector: 'fims-identity-card-scans-form',
  templateUrl: './scans.component.html'
})
export class IdentityCardScansFormComponent extends FormComponent<IdentificationCardScan[]> implements OnInit {

  files: any;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      scans: this.initScans([])
    });
  }

  get formData(): IdentificationCardScan[] {
    return this.formScans.value;
  }

  private initScans(scans: IdentificationCardScan[]): FormArray {
    const formControls: FormGroup[] = [];
    scans.forEach(scan => formControls.push(this.initScan(scan)));
    return this.formBuilder.array(formControls);
  }

  private initScan(scan?: IdentificationCardScan): FormGroup {
    return this.formBuilder.group({
      description: [scan ? scan.description : '', [Validators.required]],
      file: []
    })
  }

  get formScans(): FormArray {
    return this.form.get('scans') as FormArray;
  }

  addScan(): void {
    this.formScans.push(this.initScan());
  }

  removeScan(index: number): void {
    this.formScans.removeAt(index);
  }

  get scanControls(): AbstractControl[] {
    return this.formScans.controls;
  }

  selectEvent(file: File): void {};

}
