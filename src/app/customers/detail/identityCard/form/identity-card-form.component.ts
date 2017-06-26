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
import {FormComponent} from '../../../../../common/forms/form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {IdentificationCard} from '../../../../../services/customer/domain/identification-card.model';
import {ExpirationDate} from '../../../../../services/customer/domain/expiration-date.model';
import {FimsValidators} from '../../../../../common/validator/validators';
import {TdStepComponent} from '@covalent/core';
import {IdentityCardScansFormComponent} from './scans/scans.component';

@Component({
  selector: 'fims-identity-card-form',
  templateUrl: './identity-card-form.component.html'
})
export class IdentityCardFormComponent extends FormComponent<IdentificationCard> implements OnInit {

  @ViewChild('detailsStep') step: TdStepComponent;

  @ViewChild('scansForm') scansForm: IdentityCardScansFormComponent;

  @Input() identificationCard: IdentificationCard;

  @Input() editMode: boolean = false;

  @Output('onSave') onSave = new EventEmitter<IdentificationCard>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      number: [this.identificationCard.number, [Validators.required, Validators.maxLength(32), FimsValidators.urlSafe]],
      type: [this.identificationCard.type, [Validators.required, Validators.maxLength(128)]],
      expirationDate: [this.formatDate(this.identificationCard.expirationDate), Validators.required],
      issuer: [this.identificationCard.issuer, [Validators.required, Validators.maxLength(256)]]
    });

    this.step.open();
  }

  showNumberValidationError(): void {
    this.setError('number', 'unique', true);
  }

  private formatDate(expirationDate: ExpirationDate): string{
    if(!expirationDate) return '';
    return `${expirationDate.year}-${this.addZero(expirationDate.month)}-${this.addZero(expirationDate.day)}`;
  }

  private addZero(value: number): string{
    return ('0' + value).slice(-2);
  }

  get formData(): IdentificationCard {
    // Not needed
    return;
  }

  get scansFormState(): string {
    return this.scansForm.valid ? 'complete' : this.scansForm.pristine ? 'none' : 'required';
  }

  cancel(): void {
    this.onCancel.emit();
  }

  save(): void {
    const expirationDate: string = this.form.get('expirationDate').value;
    const chunks: string[] = expirationDate.split('-');

    const identificationCard: IdentificationCard = {
      type: this.form.get('type').value,
      number: this.form.get('number').value,
      expirationDate: {
        day: Number(chunks[2]),
        month: Number(chunks[1]),
        year: Number(chunks[0])
      },
      issuer: this.form.get('issuer').value
    };

    this.onSave.emit(identificationCard);
  }

}
