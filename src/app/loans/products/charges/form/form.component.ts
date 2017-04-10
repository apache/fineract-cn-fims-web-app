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
import {temporalOptionList} from '../../../../../components/domain/temporal.domain';
import {TdStepComponent} from '@covalent/core';
import {ActionOption, ActionOptions} from '../../../../../components/domain/action-option.model';
import {FimsValidators} from '../../../../../components/validator/validators';

interface ChargeMethodOption{
  type: ChargeMethod,
  label: string
}

@Component({
  selector: 'fims-product-charge-form-component',
  templateUrl: './form.component.html'
})
export class ProductChargeFormComponent implements OnInit{

  chargeActionOptions: ActionOption[] = ActionOptions;

  chargeMethodOptions: ChargeMethodOption[] = [
    { type: 'FIXED', label: 'Fixed'},
    { type: 'PROPORTIONAL', label: 'Proportional'}
  ];

  temporalOptions = temporalOptionList;

  detailForm: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Input() editMode: boolean;

  @Input() set charge(charge: ChargeDefinition){
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
      chargeAction: [charge.chargeAction, [Validators.required]],
      chargeMethod: [charge.chargeMethod, [Validators.required]],
      amount: [charge.amount, [Validators.required]],
      toAccountDesignator: [charge.toAccountDesignator, [Validators.required]],
      fromAccountDesignator: [charge.fromAccountDesignator, [Validators.required]],
      forCycleSizeUnit: [charge.forCycleSizeUnit, [Validators.required]],
    });
  }

  onDebtorAccountSelection(selections: string[]): void{
    this.setValue('fromAccountDesignator', selections);
  }

  onCreditorAccountSelection(selections: string[]): void{
    this.setValue('toAccountDesignator', selections);
  }

  private setValue(key: string, selections: string[]): void{
    let control: AbstractControl = this.detailForm.get(key);
    control.setValue(selections && selections.length > 0 ? selections[0] : undefined);
    control.markAsDirty();
  }

  private save(): void{
    let charge: ChargeDefinition = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value,
      chargeAction: this.detailForm.get('chargeAction').value,
      chargeMethod: this.detailForm.get('chargeMethod').value,
      amount: this.detailForm.get('amount').value,
      toAccountDesignator: this.detailForm.get('toAccountDesignator').value,
      fromAccountDesignator: this.detailForm.get('fromAccountDesignator').value,
      forCycleSizeUnit: this.detailForm.get('forCycleSizeUnit').value,

    };
    this.onSave.emit(charge);
  }

  private cancel(): void{
    this.onCancel.emit();
  }
}
