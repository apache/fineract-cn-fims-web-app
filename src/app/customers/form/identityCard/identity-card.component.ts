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

import {Component, Input} from '@angular/core';
import {FormComponent} from '../../../../components/forms/form.component';
import {Validators, FormBuilder} from '@angular/forms';
import {IdentificationCard} from '../../../../services/customer/domain/identification-card.model';
import {ExpirationDate} from '../../../../services/customer/domain/expiration-date.model';

@Component({
  selector: 'fims-customer-identity-card-form',
  templateUrl: './identity-card.component.html'
})
export class CustomerIdentityCardFormComponent extends FormComponent<IdentificationCard>{

  @Input() set formData(identificationCard: IdentificationCard) {
    identificationCard = identificationCard || { type: 'id', number: '', expirationDate: undefined };

    this.form = this.formBuilder.group({
      type: [identificationCard.type, [Validators.required]],
      number: [identificationCard.number, Validators.required],
      expirationDate: [this.formatDate(identificationCard.expirationDate), Validators.required],
      issuer: [identificationCard.issuer, Validators.required]
    })
  };

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  private formatDate(expirationDate: ExpirationDate): string{
    if(!expirationDate) return '';
    return `${expirationDate.year}-${this.addZero(expirationDate.month)}-${this.addZero(expirationDate.day)}`;
  }

  private addZero(value: number): string{
    return ('0' + value).slice(-2);
  }

  /**
   * Returns identification card if form is not pristine
   * @returns {any}
   */
  get formData(): IdentificationCard{
    if(this.form.pristine) return undefined;

    let expirationDate: string = this.form.get('expirationDate').value;
    let chunks: string[] = expirationDate.split('-');

    return {
      type: this.form.get('type').value,
      number: this.form.get('number').value,
      expirationDate: {
        day: Number(chunks[2]),
        month: Number(chunks[1]),
        year: Number(chunks[0])
      },
      issuer: this.form.get('issuer').value
    }
  }

}
