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

import {OnInit, Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {ChargeDefinition} from '../../../../../services/portfolio/domain/charge-definition.model';
import {Validators, FormGroup, FormBuilder, AbstractControl} from '@angular/forms';
import {ChargeMethod} from '../../../../../services/portfolio/domain/charge-method.model';
import {temporalOptionList} from '../../../../../common/domain/temporal.domain';
import {TdStepComponent} from '@covalent/core';
import {ActionOption, ActionOptions} from '../../../../../common/domain/action-option.model';
import {FimsValidators} from '../../../../../common/validator/validators';

interface ChargeMethodOption{
  type: ChargeMethod,
  label: string
}

@Component({
  selector: 'fims-product-charge-form-component',
  templateUrl: './form.component.html'
})
export class ProductChargeFormComponent implements OnInit {

  private _charge: ChargeDefinition;

  chargeMethodOptions: ChargeMethodOption[] = [
    { type: 'FIXED', label: 'Fixed'},
    { type: 'PROPORTIONAL', label: 'Proportional'}
  ];

  temporalOptions = temporalOptionList;

  detailForm: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Input() editMode: boolean;

  @Input() set charge(charge: ChargeDefinition){
    this._charge = charge;
    this.prepareDetailForm(charge);
  };

  @Output('onSave') onSave = new EventEmitter<ChargeDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.detailsStep.open();
  }

  private prepareDetailForm(charge: ChargeDefinition) {
    this.detailForm = this.formBuilder.group({
      identifier: [charge.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      name: [charge.name, [Validators.required]],
      description: [charge.description, [Validators.required]],
      chargeMethod: [charge.chargeMethod, [Validators.required]],
      amount: [charge.amount, [Validators.required]]
    });
  }

  save(): void{
    const charge: ChargeDefinition = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value,
      chargeAction: this.charge.chargeAction,
      chargeMethod: this.detailForm.get('chargeMethod').value,
      amount: this.detailForm.get('amount').value,
      toAccountDesignator: this.charge.toAccountDesignator,
      fromAccountDesignator: this.charge.fromAccountDesignator,
      forCycleSizeUnit: this.charge.forCycleSizeUnit,
    };

    this.onSave.emit(charge);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get charge(): ChargeDefinition {
    return this._charge;
  }
}
