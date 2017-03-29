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

import {Component, Input, Output, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {Office} from '../../../services/office/domain/office.model';
import {FimsValidators} from '../../../components/validators';

@Component({
  selector: 'fims-office-form-component',
  templateUrl: './form.component.html'
})
export class OfficeFormComponent implements OnInit {

  detailForm: FormGroup;

  addressForm: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @Input('editMode') editMode: boolean;

  @Input('office') set office(office: Office) {
    this.prepareForm(office);
  }

  @Output('onSave') onSave = new EventEmitter<Office>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
  }

  prepareForm(office: Office): void {
    this.detailForm = this.formBuilder.group({
      identifier: [office.identifier, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe()]],
      name: [office.name, Validators.required],
      description: [office.description]
    });

    this.addressForm = this.formBuilder.group({
      street: [office.address.street, Validators.required],
      city: [office.address.city, Validators.required],
      postalCode: [office.address.postalCode, Validators.maxLength(5)],
      region: [office.address.region],
      countryShortName: [office.address.countryCode, [Validators.required, Validators.maxLength(2)]],
      country: [office.address.country, Validators.required]
    })
  }

  ngOnInit(): void {
    this.step.open();
  }

  formsInvalid(): boolean {
    return (!this.addressForm.pristine && this.addressForm.invalid) || this.detailForm.invalid;
  }

  save(): void {
    let office: Office = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value
    };

    office.address = {
      street: this.addressForm.get('street').value,
      city: this.addressForm.get('city').value,
      region: this.addressForm.get('region').value,
      postalCode: this.addressForm.get('postalCode').value,
      countryCode: this.addressForm.get('countryShortName').value,
      country: this.addressForm.get('country').value
    };

    this.onSave.emit(office);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
