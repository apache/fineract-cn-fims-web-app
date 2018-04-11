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
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ChargeDefinition} from '../../../../services/portfolio/domain/charge-definition.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChargeMethod} from '../../../../services/portfolio/domain/charge-method.model';
import {temporalOptionList} from '../../../../common/domain/temporal.domain';
import {FimsValidators} from '../../../../common/validator/validators';
import {ChargeProportionalDesignators} from '../../../../services/portfolio/domain/individuallending/charge-proportional-designators.model';
import {FimsRange} from '../../../../services/portfolio/domain/range-model';

interface ChargeMethodOption {
  type: ChargeMethod;
  label: string;
}

@Component({
  selector: 'fims-product-charge-form-component',
  templateUrl: './form.component.html'
})
export class ProductChargeFormComponent implements OnChanges {

  numberFormat = '1.2-2';

  chargeMethodOptions: ChargeMethodOption[] = [
    { type: 'FIXED', label: 'Fixed'},
    { type: 'PROPORTIONAL', label: 'Proportional'}
  ];

  proportionalToOptions: any[] = [
    { label: 'Maximum balance', designator: ChargeProportionalDesignators.MAXIMUM_BALANCE_DESIGNATOR },
    { label: 'Repayment', designator: ChargeProportionalDesignators.REQUESTED_DISBURSEMENT_DESIGNATOR },
    { label: 'Running balance', designator: ChargeProportionalDesignators.RUNNING_BALANCE_DESIGNATOR }
  ];

  temporalOptions = temporalOptionList;

  detailForm: FormGroup;

  selectedRange: FimsRange;

  @Input() editMode: boolean;

  @Input() charge: ChargeDefinition;

  @Input() ranges: FimsRange[];

  @Output('onSave') onSave = new EventEmitter<ChargeDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.detailForm = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      chargeMethod: ['', [Validators.required]],
      proportionalTo: ['', [Validators.required]],
      amount: [0, [Validators.required]],
      rangeEnabled: [false],
      rangeIdentifier: ['', Validators.required],
      rangeSegmentIdentifier: ['', Validators.required]
    });

    this.detailForm.get('chargeMethod').valueChanges
      .subscribe(value => this.toggleChargeMethod(value));

    this.detailForm.get('rangeIdentifier').valueChanges
      .subscribe(identifier => this.toggleRange(identifier));

    this.detailForm.get('rangeEnabled').valueChanges
      .subscribe(enabled => this.toggleRangeEnabled(enabled));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.charge) {
      const chargeData: any = {
        identifier: this.charge.identifier,
        name: this.charge.name,
        description: this.charge.description,
        chargeMethod: this.charge.chargeMethod,
        proportionalTo: this.charge.proportionalTo,
        amount: this.charge.amount
      };

      if (this.charge.forSegmentSet) {
        chargeData.rangeEnabled = true;
        chargeData.rangeIdentifier = this.charge.forSegmentSet;
        chargeData.rangeSegmentIdentifier = this.charge.fromSegment ? [this.charge.fromSegment] : [];
      }

      this.detailForm.reset(chargeData);
    }

    if (changes.ranges) {
      this.toggleRange(this.detailForm.get('rangeIdentifier').value);
    }
  }

  private toggleChargeMethod(chargeMethod: ChargeMethod): void {
    const proportionalTo = this.detailForm.get('proportionalTo');

    if (chargeMethod === 'PROPORTIONAL') {
      proportionalTo.enable();
      proportionalTo.setValidators(Validators.required);
    } else {
      proportionalTo.disable();
      proportionalTo.clearValidators();
    }
    proportionalTo.updateValueAndValidity();
  }

  toggleRange(identifier: string): void {
    if (this.ranges) {
      this.selectedRange = this.ranges.find(range => range.identifier === identifier);
    }
  }

  toggleRangeEnabled(enabled: boolean): void {
    const rangeIdentifier = this.detailForm.get('rangeIdentifier');
    const rangeSegmentIdentifier = this.detailForm.get('rangeSegmentIdentifier');

    if (enabled) {
      rangeIdentifier.setValidators(Validators.required);
      rangeSegmentIdentifier.setValidators(Validators.required);
    } else {
      rangeIdentifier.clearValidators();
      rangeSegmentIdentifier.clearValidators();
    }

    rangeIdentifier.updateValueAndValidity();
    rangeSegmentIdentifier.updateValueAndValidity();
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

    if (this.detailForm.get('rangeEnabled').value) {
      charge.forSegmentSet = this.detailForm.get('rangeIdentifier').value;
      const segmentIdentifier = this.detailForm.get('rangeSegmentIdentifier').value;
      charge.fromSegment = segmentIdentifier;
      charge.toSegment = segmentIdentifier;
    } else {
      delete charge.forSegmentSet;
      delete charge.fromSegment;
      delete charge.toSegment;
    }

    this.onSave.emit(charge);
  }

  cancel(): void {
    this.onCancel.emit();
  }

}
