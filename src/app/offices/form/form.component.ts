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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {Office} from '../../../services/office/domain/office.model';
import {FimsValidators} from '../../../common/validator/validators';
import {Address} from '../../../services/domain/address/address.model';
import {AddressFormComponent} from '../../../common/address/address.component';


@Component({
  selector: 'fims-office-form-component',
  templateUrl: './form.component.html'
})
export class OfficeFormComponent implements OnInit {

  private _office: Office;

  detailForm: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @ViewChild('addressForm') addressForm: AddressFormComponent;
  addressFormData: Address;

  @Input('editMode') editMode: boolean;

  @Input('office') set office(office: Office) {
    this._office = office;
    this.prepareForm(office);
  }

  @Output('onSave') onSave = new EventEmitter<Office>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  prepareForm(office: Office): void {
    this.detailForm = this.formBuilder.group({
      identifier: [office.identifier, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe()]],
      name: [office.name, Validators.required],
      description: [office.description]
    });

    this.addressFormData = office.address;
  }

  ngOnInit(): void {
    this.step.open();
  }

  formsInvalid(): boolean {
    return ((this.editMode || !this.addressForm.pristine) && !this.addressForm.valid) || this.detailForm.invalid;
  }

  save(): void {
    let office: Office = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value
    };

    if(this.addressForm.pristine) {
      office.address = this.office.address;
    } else {
      office.address = this.addressForm.formData;
    }

    this.onSave.emit(office);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get office(): Office {
    return this._office;
  }

}
