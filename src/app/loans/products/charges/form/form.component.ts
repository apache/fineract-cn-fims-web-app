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

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ChargeDefinition} from '../../../../services/portfolio/domain/charge-definition.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChargeMethod} from '../../../../services/portfolio/domain/charge-method.model';
import {temporalOptionList} from '../../../../common/domain/temporal.domain';
import {FimsValidators} from '../../../../common/validator/validators';
import {ChargeProportionalDesignators} from '../../../../services/portfolio/domain/individuallending/charge-proportional-designators.model';
import {BalanceSegmentSet} from '../../../../services/portfolio/domain/balance-segment-set.model';

interface ChargeMethodOption {
  type: ChargeMethod,
  label: string
}

@Component({
  selector: 'fims-product-charge-form-component',
  templateUrl: './form.component.html'
})
export class ProductChargeFormComponent implements OnChanges {

  chargeMethodOptions: ChargeMethodOption[] = [
    { type: 'FIXED', label: 'Fixed'},
    { type: 'PROPORTIONAL', label: 'Proportional'}
  ];

  proportionalToOptions: any[] = [
    { label: 'Maximum balance', designator: ChargeProportionalDesignators.MAXIMUM_BALANCE_DESIGNATOR },
    { label: 'Repayment', designator: ChargeProportionalDesignators.REPAYMENT_DESIGNATOR },
    { label: 'Running balance', designator: ChargeProportionalDesignators.RUNNING_BALANCE_DESIGNATOR }
  ];

  temporalOptions = temporalOptionList;

  detailForm: FormGroup;

  @Input() editMode: boolean;

  @Input() charge: ChargeDefinition;

  @Input() balanceSegmentSets: BalanceSegmentSet[];

  @Output('onSave') onSave = new EventEmitter<ChargeDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.detailForm = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      chargeMethod: ['', [Validators.required]],
      proportionalTo: ['', [Validators.required]],
      amount: [0, [Validators.required]]
    });

    this.detailForm.get('chargeMethod').valueChanges
      .subscribe(value => this.toggleChargeMethod(value))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.charge) {
      this.detailForm.reset({
        identifier: this.charge.identifier,
        name: this.charge.name,
        description: this.charge.description,
        chargeMethod: this.charge.chargeMethod,
        proportionalTo: this.charge.proportionalTo,
        amount: this.charge.amount
      });
    }
  }

  private toggleChargeMethod(chargeMethod: ChargeMethod): void {
    const proportionalTo = this.detailForm.get('proportionalTo');

    if(chargeMethod === 'PROPORTIONAL') {
      proportionalTo.enable();
      proportionalTo.setValidators(Validators.required);
      proportionalTo.updateValueAndValidity();
    } else {
      proportionalTo.disable();
      proportionalTo.clearValidators();
      proportionalTo.updateValueAndValidity();
    }
  }

  save(): void {
    const chargeMethod: ChargeMethod = this.detailForm.get('chargeMethod').value;

    const charge: ChargeDefinition = Object.assign({}, this.charge, {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value,
      chargeMethod,
      amount: this.detailForm.get('amount').value,
      proportionalTo: chargeMethod === 'PROPORTIONAL' ? this.detailForm.get('proportionalTo').value : undefined
    });

    this.onSave.emit(charge);
  }

  cancel(): void {
    this.onCancel.emit();
  }

}
